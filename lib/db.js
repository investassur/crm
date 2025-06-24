import { Pool } from 'pg';

// Configuration de la connexion à la base de données Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Fonction helper pour exécuter des requêtes SQL
export async function sql(strings, ...values) {
  const client = await pool.connect();
  
  try {
    let query = '';
    let params = [];
    
    if (typeof strings === 'string') {
      // Si c'est une requête simple
      query = strings;
      params = values;
    } else {
      // Si c'est un template literal
      query = strings.reduce((acc, str, i) => {
        acc += str;
        if (i < values.length) {
          params.push(values[i]);
          acc += `$${params.length}`;
        }
        return acc;
      }, '');
    }
    
    console.log('Executing query:', query);
    console.log('With params:', params);
    
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Fonction pour les transactions
sql.transaction = async (queries) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const results = [];
    
    for (const query of queries) {
      const result = await client.query(query);
      results.push(result.rows);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;