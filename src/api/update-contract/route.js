async function handler({
  id,
  prospect_id,
  contract_number,
  product_type,
  premium_amount,
  commission_rate,
  status,
  start_date,
  end_date,
  notes,
}) {
  if (!id) {
    return { error: "Contract ID is required" };
  }

  const existingContract = await sql`
    SELECT id, premium_amount, commission_rate FROM contracts WHERE id = ${id}
  `;

  if (existingContract.length === 0) {
    return { error: "Contract not found" };
  }

  if (prospect_id) {
    const prospectExists = await sql`
      SELECT id FROM prospects WHERE id = ${prospect_id}
    `;

    if (prospectExists.length === 0) {
      return { error: "Prospect not found" };
    }
  }

  if (contract_number) {
    const existingContractNumber = await sql`
      SELECT id FROM contracts WHERE contract_number = ${contract_number} AND id != ${id}
    `;

    if (existingContractNumber.length > 0) {
      return { error: "Contract number already exists" };
    }
  }

  let setClauses = [];
  let values = [];
  let paramCount = 0;

  if (prospect_id !== undefined) {
    paramCount++;
    setClauses.push(`prospect_id = $${paramCount}`);
    values.push(prospect_id);
  }

  if (contract_number !== undefined) {
    paramCount++;
    setClauses.push(`contract_number = $${paramCount}`);
    values.push(contract_number);
  }

  if (product_type !== undefined) {
    paramCount++;
    setClauses.push(`product_type = $${paramCount}`);
    values.push(product_type);
  }

  if (premium_amount !== undefined) {
    paramCount++;
    setClauses.push(`premium_amount = $${paramCount}`);
    values.push(premium_amount);
  }

  if (commission_rate !== undefined) {
    paramCount++;
    setClauses.push(`commission_rate = $${paramCount}`);
    values.push(commission_rate);
  }

  if (status !== undefined) {
    paramCount++;
    setClauses.push(`status = $${paramCount}`);
    values.push(status);
  }

  if (start_date !== undefined) {
    paramCount++;
    setClauses.push(`start_date = $${paramCount}`);
    values.push(start_date);
  }

  if (end_date !== undefined) {
    paramCount++;
    setClauses.push(`end_date = $${paramCount}`);
    values.push(end_date);
  }

  if (notes !== undefined) {
    paramCount++;
    setClauses.push(`notes = $${paramCount}`);
    values.push(notes);
  }

  const currentPremium =
    premium_amount !== undefined
      ? premium_amount
      : existingContract[0].premium_amount;
  const currentRate =
    commission_rate !== undefined
      ? commission_rate
      : existingContract[0].commission_rate;

  if (premium_amount !== undefined || commission_rate !== undefined) {
    const commission_amount = (currentPremium * currentRate) / 100;
    paramCount++;
    setClauses.push(`commission_amount = $${paramCount}`);
    values.push(commission_amount);
  }

  if (setClauses.length === 0) {
    return { error: "No fields to update" };
  }

  paramCount++;
  setClauses.push(`updated_at = $${paramCount}`);
  values.push(new Date());

  paramCount++;
  values.push(id);

  const queryString = `
    UPDATE contracts 
    SET ${setClauses.join(", ")}
    WHERE id = $${paramCount}
    RETURNING id, prospect_id, contract_number, product_type, premium_amount, 
              commission_rate, commission_amount, status, start_date, end_date, 
              notes, created_at, updated_at
  `;

  const updatedContract = await sql(queryString, values);

  return {
    contract: updatedContract[0],
    success: true,
  };
}
export async function POST(request) {
  return handler(await request.json());
}