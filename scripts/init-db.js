import { initializeDatabase } from '../lib/init-db.js';

async function main() {
  try {
    console.log('🚀 Démarrage de l\'initialisation de la base de données...');
    
    const result = await initializeDatabase();
    
    if (result.success) {
      console.log('✅ Base de données initialisée avec succès !');
      console.log('📊 Tables créées et données de base insérées');
      console.log('👤 Utilisateur admin créé: admin@premunia.fr');
      console.log('🔑 Mot de passe par défaut: PREMUNIA2024!');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

main();