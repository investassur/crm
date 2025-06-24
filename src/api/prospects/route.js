import { sql } from '../../../lib/db.js';

async function handler({ status, source, search }) {
  try {
    let queryString = `
      SELECT id, first_name, last_name, email, phone, age, status, source, notes, assigned_to, created_at, updated_at 
      FROM prospects 
      WHERE 1=1
    `;
    let values = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      queryString += ` AND status = $${paramCount}`;
      values.push(status);
    }

    if (source) {
      paramCount++;
      queryString += ` AND source = $${paramCount}`;
      values.push(source);
    }

    if (search) {
      paramCount++;
      queryString += ` AND (LOWER(first_name) LIKE LOWER($${paramCount}) OR LOWER(last_name) LIKE LOWER($${paramCount}) OR LOWER(email) LIKE LOWER($${paramCount}))`;
      values.push(`%${search}%`);
    }

    queryString += " ORDER BY created_at DESC";

    const prospects = await sql(queryString, values);

    return {
      prospects: prospects,
      count: prospects.length,
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      error: 'Database error occurred',
      message: error.message
    };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await handler(body);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}