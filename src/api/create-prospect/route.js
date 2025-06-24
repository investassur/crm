async function handler({
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
  if (!first_name || !last_name) {
    return { error: "First name and last name are required" };
  }

  const prospect = await sql`
    INSERT INTO prospects (first_name, last_name, email, phone, age, status, source, notes, assigned_to)
    VALUES (${first_name}, ${last_name}, ${email || null}, ${phone || null}, ${
    age || null
  }, ${status || "nouveau"}, ${source || null}, ${notes || null}, ${
    assigned_to || null
  })
    RETURNING id, first_name, last_name, email, phone, age, status, source, notes, assigned_to, created_at, updated_at
  `;

  return {
    prospect: prospect[0],
    success: true,
  };
}
export async function POST(request) {
  return handler(await request.json());
}