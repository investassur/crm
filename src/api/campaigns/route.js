async function handler({
  status,
  campaign_type,
  search,
  page = 1,
  limit = 10,
  sort_by = "created_at",
  sort_order = "DESC",
}) {
  try {
    const offset = (page - 1) * limit;

    let queryString = `
      SELECT 
        id, 
        name, 
        description, 
        campaign_type, 
        status, 
        start_date, 
        end_date, 
        target_audience, 
        budget, 
        created_by, 
        created_at, 
        updated_at
      FROM campaigns 
      WHERE 1=1
    `;

    let countQuery = "SELECT COUNT(*) as total FROM campaigns WHERE 1=1";
    let values = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      queryString += ` AND status = $${paramCount}`;
      countQuery += ` AND status = $${paramCount}`;
      values.push(status);
    }

    if (campaign_type) {
      paramCount++;
      queryString += ` AND campaign_type = $${paramCount}`;
      countQuery += ` AND campaign_type = $${paramCount}`;
      values.push(campaign_type);
    }

    if (search) {
      paramCount++;
      queryString += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`;
      countQuery += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`;
      values.push(`%${search}%`);
    }

    const validSortColumns = [
      "name",
      "campaign_type",
      "status",
      "start_date",
      "end_date",
      "budget",
      "created_at",
      "updated_at",
    ];
    const sortColumn = validSortColumns.includes(sort_by)
      ? sort_by
      : "created_at";
    const sortDirection = sort_order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    queryString += ` ORDER BY ${sortColumn} ${sortDirection}`;

    paramCount++;
    queryString += ` LIMIT $${paramCount}`;
    values.push(limit);

    paramCount++;
    queryString += ` OFFSET $${paramCount}`;
    values.push(offset);

    const [campaigns, totalResult] = await sql.transaction([
      sql(queryString, values),
      sql(countQuery, values.slice(0, -2)),
    ]);

    const total = parseInt(totalResult[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      campaigns: campaigns,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: total,
        items_per_page: limit,
        has_next: page < totalPages,
        has_previous: page > 1,
      },
      filters: {
        status,
        campaign_type,
        search,
      },
      sort: {
        sort_by: sortColumn,
        sort_order: sortDirection,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Database error occurred while fetching campaigns",
      message: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}