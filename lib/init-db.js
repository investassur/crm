import { sql } from './db.js';

// Script d'initialisation de la base de données
export async function initializeDatabase() {
  try {
    console.log('Initialisation de la base de données...');

    // Création de la table users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) DEFAULT 'user',
        department VARCHAR(100),
        permissions JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Création de la table prospects
    await sql`
      CREATE TABLE IF NOT EXISTS prospects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        age INTEGER,
        status VARCHAR(50) DEFAULT 'nouveau',
        source VARCHAR(100),
        notes TEXT,
        assigned_to UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Création de la table contracts
    await sql`
      CREATE TABLE IF NOT EXISTS contracts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        prospect_id UUID REFERENCES prospects(id),
        contract_number VARCHAR(100) UNIQUE NOT NULL,
        product_type VARCHAR(100) NOT NULL,
        premium_amount DECIMAL(10,2) NOT NULL,
        commission_rate DECIMAL(5,2) NOT NULL,
        commission_amount DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'brouillon',
        start_date DATE,
        end_date DATE,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Création de la table tasks
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(200) NOT NULL,
        description TEXT,
        due_date TIMESTAMPTZ,
        priority VARCHAR(20) DEFAULT 'moyenne',
        status VARCHAR(50) DEFAULT 'a_faire',
        assigned_to UUID REFERENCES users(id),
        prospect_id UUID REFERENCES prospects(id),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Création de la table campaigns
    await sql`
      CREATE TABLE IF NOT EXISTS campaigns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        campaign_type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'brouillon',
        start_date DATE,
        end_date DATE,
        target_audience TEXT,
        budget DECIMAL(10,2),
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Création de la table email_templates
    await sql`
      CREATE TABLE IF NOT EXISTS email_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        body TEXT NOT NULL,
        template_type VARCHAR(100),
        variables JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        usage_count INTEGER DEFAULT 0,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Création de la table workflows
    await sql`
      CREATE TABLE IF NOT EXISTS workflows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        trigger_event VARCHAR(100) NOT NULL,
        conditions JSONB DEFAULT '[]',
        actions JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        executions_count INTEGER DEFAULT 0,
        success_rate DECIMAL(5,2) DEFAULT 0,
        last_execution TIMESTAMPTZ,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Création de la table role_permissions
    await sql`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role VARCHAR(50) NOT NULL,
        module VARCHAR(50) NOT NULL,
        permissions JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(role, module)
      )
    `;

    // Création de la table audit_log
    await sql`
      CREATE TABLE IF NOT EXISTS audit_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        module VARCHAR(50) NOT NULL,
        resource_type VARCHAR(50),
        resource_id UUID,
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insertion des permissions par défaut
    await sql`
      INSERT INTO role_permissions (role, module, permissions) VALUES
      ('super_admin', 'admin', '{"read": true, "write": true, "delete": true, "admin": true}'),
      ('super_admin', 'prospects', '{"read": true, "write": true, "delete": true, "admin": true}'),
      ('super_admin', 'campaigns', '{"read": true, "write": true, "delete": true, "admin": true}'),
      ('super_admin', 'tasks', '{"read": true, "write": true, "delete": true, "admin": true}'),
      ('super_admin', 'contracts', '{"read": true, "write": true, "delete": true, "admin": true}'),
      ('super_admin', 'reports', '{"read": true, "write": true, "delete": true, "admin": true}'),
      ('super_admin', 'templates', '{"read": true, "write": true, "delete": true, "admin": true}'),
      ('super_admin', 'workflows', '{"read": true, "write": true, "delete": true, "admin": true}'),
      ('super_admin', 'segmentation', '{"read": true, "write": true, "delete": true, "admin": true}'),
      
      ('admin', 'prospects', '{"read": true, "write": true, "delete": true}'),
      ('admin', 'campaigns', '{"read": true, "write": true, "delete": true}'),
      ('admin', 'tasks', '{"read": true, "write": true, "delete": true}'),
      ('admin', 'contracts', '{"read": true, "write": true, "delete": true}'),
      ('admin', 'reports', '{"read": true, "write": true}'),
      ('admin', 'templates', '{"read": true, "write": true, "delete": true}'),
      ('admin', 'workflows', '{"read": true, "write": true, "delete": true}'),
      ('admin', 'segmentation', '{"read": true, "write": true}'),
      
      ('manager', 'prospects', '{"read": true, "write": true}'),
      ('manager', 'campaigns', '{"read": true, "write": true}'),
      ('manager', 'tasks', '{"read": true, "write": true}'),
      ('manager', 'contracts', '{"read": true, "write": true}'),
      ('manager', 'reports', '{"read": true}'),
      ('manager', 'templates', '{"read": true, "write": true}'),
      ('manager', 'workflows', '{"read": true}'),
      ('manager', 'segmentation', '{"read": true}'),
      
      ('user', 'prospects', '{"read": true, "write": true}'),
      ('user', 'tasks', '{"read": true, "write": true}'),
      ('user', 'contracts', '{"read": true}'),
      ('user', 'templates', '{"read": true}')
      ON CONFLICT (role, module) DO NOTHING
    `;

    // Création d'un utilisateur super admin par défaut
    await sql`
      INSERT INTO users (email, first_name, last_name, role, password_hash, is_active)
      VALUES ('admin@premunia.fr', 'Admin', 'PREMUNIA', 'super_admin', 'PREMUNIA2024!', true)
      ON CONFLICT (email) DO NOTHING
    `;

    console.log('Base de données initialisée avec succès !');
    return { success: true, message: 'Base de données initialisée' };

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}