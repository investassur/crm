async function handler({
  prospect_id,
  contract_number,
  product_type,
  premium_amount,
  commission_rate,
  start_date,
  end_date,
  notes,
}) {
  if (
    !prospect_id ||
    !contract_number ||
    !product_type ||
    !premium_amount ||
    !commission_rate
  ) {
    return {
      error:
        "prospect_id, contract_number, product_type, premium_amount, and commission_rate are required",
    };
  }

  const prospectExists = await sql`
    SELECT id FROM prospects WHERE id = ${prospect_id}
  `;

  if (prospectExists.length === 0) {
    return { error: "Prospect not found" };
  }

  const existingContract = await sql`
    SELECT id FROM contracts WHERE contract_number = ${contract_number}
  `;

  if (existingContract.length > 0) {
    return { error: "Contract number already exists" };
  }

  const commission_amount = (premium_amount * commission_rate) / 100;

  const contract = await sql`
    INSERT INTO contracts (
      prospect_id, contract_number, product_type, premium_amount, 
      commission_rate, commission_amount, start_date, end_date, notes
    )
    VALUES (
      ${prospect_id}, ${contract_number}, ${product_type}, ${premium_amount},
      ${commission_rate}, ${commission_amount}, ${start_date || null}, ${
    end_date || null
  }, ${notes || null}
    )
    RETURNING id, prospect_id, contract_number, product_type, premium_amount, 
              commission_rate, commission_amount, status, start_date, end_date, 
              notes, created_at, updated_at
  `;

  return {
    contract: contract[0],
    success: true,
  };
}
export async function POST(request) {
  return handler(await request.json());
}