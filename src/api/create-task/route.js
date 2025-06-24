async function handler({
  title,
  description,
  due_date,
  priority,
  assigned_to,
  prospect_id,
}) {
  if (!title) {
    return {
      error: "Title is required",
    };
  }

  if (assigned_to) {
    const userExists = await sql`
      SELECT id FROM users WHERE id = ${assigned_to}
    `;

    if (userExists.length === 0) {
      return { error: "Assigned user not found" };
    }
  }

  if (prospect_id) {
    const prospectExists = await sql`
      SELECT id FROM prospects WHERE id = ${prospect_id}
    `;

    if (prospectExists.length === 0) {
      return { error: "Prospect not found" };
    }
  }

  const task = await sql`
    INSERT INTO tasks (
      title, description, due_date, priority, assigned_to, prospect_id, status
    )
    VALUES (
      ${title}, ${description || null}, ${due_date || null}, ${
    priority || "moyenne"
  }, 
      ${assigned_to || null}, ${prospect_id || null}, 'a_faire'
    )
    RETURNING id, title, description, due_date, priority, status, assigned_to, 
              prospect_id, created_at, updated_at
  `;

  return {
    task: task[0],
    success: true,
  };
}
export async function POST(request) {
  return handler(await request.json());
}