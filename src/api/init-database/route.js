import { initializeDatabase } from '../../../lib/init-db.js';

export async function POST() {
  try {
    const result = await initializeDatabase();
    return Response.json(result);
  } catch (error) {
    console.error('Database initialization error:', error);
    return Response.json(
      { 
        error: 'Failed to initialize database',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}