async function handler({
  status,
  product_type,
  prospect_id,
  contract_number,
  search,
  page = 1,
  limit = 20,
  sort_order = "desc",
}) {
  let queryString = `
    SELECT 
      c.id, c.contract_number, c.product_type, c.premium_amount, 
      c.commission_rate, c.commission_amount, c.status, c.start_date, 
      c.end_date, c.notes, c.created_at, c.updated_at,
      p.first_name, p.last_name, p.email, p.phone, p.company
    FROM contracts c
    LEFT JOIN prospects p ON c.prospect_id = p.id
    WHERE 1=1
  `;

  let values = [];
  let paramCount = 0;

  if (status) {
    paramCount++;
    queryString += ` AND c.status = $${paramCount}`;
    values.push(status);
  }

  if (product_type) {
    paramCount++;
    queryString += ` AND c.product_type = $${paramCount}`;
    values.push(product_type);
  }

  if (prospect_id) {
    paramCount++;
    queryString += ` AND c.prospect_id = $${paramCount}`;
    values.push(prospect_id);
  }

  if (contract_number) {
    paramCount++;
    queryString += ` AND c.contract_number = $${paramCount}`;
    values.push(contract_number);
  }

  if (search) {
    paramCount++;
    queryString += ` AND (
      LOWER(c.contract_number) LIKE LOWER($${paramCount}) OR 
      LOWER(c.product_type) LIKE LOWER($${paramCount}) OR
      LOWER(p.first_name) LIKE LOWER($${paramCount}) OR
      LOWER(p.last_name) LIKE LOWER($${paramCount})
    )`;
    values.push(`%${search}%`);
  }

  const sortDirection = sort_order === "asc" ? "ASC" : "DESC";
  queryString += ` ORDER BY c.created_at ${sortDirection}`;

  const offset = (page - 1) * limit;
  paramCount++;
  queryString += ` LIMIT $${paramCount}`;
  values.push(limit);

  paramCount++;
  queryString += ` OFFSET $${paramCount}`;
  values.push(offset);

  let countQuery = `
    SELECT COUNT(*) as total
    FROM contracts c
    LEFT JOIN prospects p ON c.prospect_id = p.id
    WHERE 1=1
  `;
  let countValues = [];
  let countParamCount = 0;

  if (status) {
    countParamCount++;
    countQuery += ` AND c.status = $${countParamCount}`;
    countValues.push(status);
  }

  if (product_type) {
    countParamCount++;
    countQuery += ` AND c.product_type = $${countParamCount}`;
    countValues.push(product_type);
  }

  if (prospect_id) {
    countParamCount++;
    countQuery += ` AND c.prospect_id = $${countParamCount}`;
    countValues.push(prospect_id);
  }

  if (contract_number) {
    countParamCount++;
    countQuery += ` AND c.contract_number = $${countParamCount}`;
    countValues.push(contract_number);
  }

  if (search) {
    countParamCount++;
    countQuery += ` AND (
      LOWER(c.contract_number) LIKE LOWER($${countParamCount}) OR 
      LOWER(c.product_type) LIKE LOWER($${countParamCount}) OR
      LOWER(p.first_name) LIKE LOWER($${countParamCount}) OR
      LOWER(p.last_name) LIKE LOWER($${countParamCount})
    )`;
    countValues.push(`%${search}%`);
  }

  const [contracts, totalResult] = await sql.transaction([
    sql(queryString, values),
    sql(countQuery, countValues),
  ]);

  const total = parseInt(totalResult[0].total);
  const totalPages = Math.ceil(total / limit);

  return {
    contracts: contracts,
    pagination: {
      current_page: page,
      total_pages: totalPages,
      total_contracts: total,
      limit: limit,
      has_next: page < totalPages,
      has_previous: page > 1,
    },
  };
}
export async function POST(request) {
  return handler(await request.json());
}