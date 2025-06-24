async function handler({
  id,
  first_name,
  last_name,
  email,
  phone,
  age,
  status,
  source,
  notes,
  assigned_to,
}) {
  if (!id) {
    return { error: "Prospect ID is required" };
  }

  const existingProspect = await sql`
    SELECT id FROM prospects WHERE id = ${id}
  `;

  if (existingProspect.length === 0) {
    return { error: "Prospect not found" };
  }

  let queryString = "UPDATE prospects SET updated_at = CURRENT_TIMESTAMP";
  let values = [];
  let paramCount = 0;

  if (first_name !== undefined) {
    paramCount++;
    queryString += `, first_name = $${paramCount}`;
    values.push(first_name);
  }

  if (last_name !== undefined) {
    paramCount++;
    queryString += `, last_name = $${paramCount}`;
    values.push(last_name);
  }

  if (email !== undefined) {
    paramCount++;
    queryString += `, email = $${paramCount}`;
    values.push(email);
  }

  if (phone !== undefined) {
    paramCount++;
    queryString += `, phone = $${paramCount}`;
    values.push(phone);
  }

  if (age !== undefined) {
    paramCount++;
    queryString += `, age = $${paramCount}`;
    values.push(age);
  }

  if (status !== undefined) {
    paramCount++;
    queryString += `, status = $${paramCount}`;
    values.push(status);
  }

  if (source !== undefined) {
    paramCount++;
    queryString += `, source = $${paramCount}`;
    values.push(source);
  }

  if (notes !== undefined) {
    paramCount++;
    queryString += `, notes = $${paramCount}`;
    values.push(notes);
  }

  if (assigned_to !== undefined) {
    paramCount++;
    queryString += `, assigned_to = $${paramCount}`;
    values.push(assigned_to);
  }

  paramCount++;
  queryString += ` WHERE id = $${paramCount} RETURNING id, first_name, last_name, email, phone, age, status, source, notes, assigned_to, created_at, updated_at`;
  values.push(id);

  const updatedProspect = await sql(queryString, values);

  return {
    prospect: updatedProspect[0],
    success: true,
  };
}
export async function POST(request) {
  return handler(await request.json());
}