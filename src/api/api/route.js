async function handler({ status, source, search }) {
  let queryString =
    "SELECT id, first_name, last_name, email, phone, age, status, source, notes, assigned_to, created_at, updated_at FROM prospects WHERE 1=1";
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
}
export async function POST(request) {
  return handler(await request.json());
}