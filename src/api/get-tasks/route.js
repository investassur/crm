async function handler({
  status,
  priority,
  assigned_to,
  prospect_id,
  search,
  page = 1,
  limit = 20,
  sort_order = "asc",
}) {
  let queryString = `
    SELECT 
      t.id, t.title, t.description, t.due_date, t.priority, t.status,
      t.assigned_to, t.prospect_id, t.created_at, t.updated_at,
      p.first_name as prospect_first_name, p.last_name as prospect_last_name,
      p.email as prospect_email, p.phone as prospect_phone,
      u.first_name as assigned_first_name, u.last_name as assigned_last_name,
      u.email as assigned_email
    FROM tasks t
    LEFT JOIN prospects p ON t.prospect_id = p.id
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE 1=1
  `;

  let values = [];
  let paramCount = 0;

  if (status) {
    paramCount++;
    queryString += ` AND t.status = $${paramCount}`;
    values.push(status);
  }

  if (priority) {
    paramCount++;
    queryString += ` AND t.priority = $${paramCount}`;
    values.push(priority);
  }

  if (assigned_to) {
    paramCount++;
    queryString += ` AND t.assigned_to = $${paramCount}`;
    values.push(assigned_to);
  }

  if (prospect_id) {
    paramCount++;
    queryString += ` AND t.prospect_id = $${paramCount}`;
    values.push(prospect_id);
  }

  if (search) {
    paramCount++;
    queryString += ` AND LOWER(t.title) LIKE LOWER($${paramCount})`;
    values.push(`%${search}%`);
  }

  const sortDirection = sort_order === "desc" ? "DESC" : "ASC";
  queryString += ` ORDER BY t.due_date ${sortDirection}`;

  const offset = (page - 1) * limit;
  paramCount++;
  queryString += ` LIMIT $${paramCount}`;
  values.push(limit);

  paramCount++;
  queryString += ` OFFSET $${paramCount}`;
  values.push(offset);

  let countQuery = `
    SELECT COUNT(*) as total
    FROM tasks t
    LEFT JOIN prospects p ON t.prospect_id = p.id
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE 1=1
  `;
  let countValues = [];
  let countParamCount = 0;

  if (status) {
    countParamCount++;
    countQuery += ` AND t.status = $${countParamCount}`;
    countValues.push(status);
  }

  if (priority) {
    countParamCount++;
    countQuery += ` AND t.priority = $${countParamCount}`;
    countValues.push(priority);
  }

  if (assigned_to) {
    countParamCount++;
    countQuery += ` AND t.assigned_to = $${countParamCount}`;
    countValues.push(assigned_to);
  }

  if (prospect_id) {
    countParamCount++;
    countQuery += ` AND t.prospect_id = $${countParamCount}`;
    countValues.push(prospect_id);
  }

  if (search) {
    countParamCount++;
    countQuery += ` AND LOWER(t.title) LIKE LOWER($${countParamCount})`;
    countValues.push(`%${search}%`);
  }

  const [tasks, totalResult] = await sql.transaction([
    sql(queryString, values),
    sql(countQuery, countValues),
  ]);

  const total = parseInt(totalResult[0].total);
  const totalPages = Math.ceil(total / limit);

  return {
    tasks: tasks,
    pagination: {
      current_page: page,
      total_pages: totalPages,
      total_tasks: total,
      limit: limit,
      has_next: page < totalPages,
      has_previous: page > 1,
    },
  };
}
export async function POST(request) {
  return handler(await request.json());
}