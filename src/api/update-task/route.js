async function handler({
  id,
  title,
  description,
  due_date,
  priority,
  status,
  assigned_to,
  prospect_id,
}) {
  if (!id) {
    return { error: "Task ID is required" };
  }

  const existingTask = await sql`
    SELECT id FROM tasks WHERE id = ${id}
  `;

  if (existingTask.length === 0) {
    return { error: "Task not found" };
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

  let queryString = "UPDATE tasks SET updated_at = CURRENT_TIMESTAMP";
  let values = [];
  let paramCount = 0;

  if (title !== undefined) {
    paramCount++;
    queryString += `, title = $${paramCount}`;
    values.push(title);
  }

  if (description !== undefined) {
    paramCount++;
    queryString += `, description = $${paramCount}`;
    values.push(description);
  }

  if (due_date !== undefined) {
    paramCount++;
    queryString += `, due_date = $${paramCount}`;
    values.push(due_date);
  }

  if (priority !== undefined) {
    paramCount++;
    queryString += `, priority = $${paramCount}`;
    values.push(priority);
  }

  if (status !== undefined) {
    paramCount++;
    queryString += `, status = $${paramCount}`;
    values.push(status);
  }

  if (assigned_to !== undefined) {
    paramCount++;
    queryString += `, assigned_to = $${paramCount}`;
    values.push(assigned_to);
  }

  if (prospect_id !== undefined) {
    paramCount++;
    queryString += `, prospect_id = $${paramCount}`;
    values.push(prospect_id);
  }

  paramCount++;
  queryString += ` WHERE id = $${paramCount} RETURNING id, title, description, due_date, priority, status, assigned_to, prospect_id, created_at, updated_at`;
  values.push(id);

  const updatedTask = await sql(queryString, values);

  return {
    task: updatedTask[0],
    success: true,
  };
}
export async function POST(request) {
  return handler(await request.json());
}