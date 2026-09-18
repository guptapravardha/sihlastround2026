import { query } from "../db/pool.js";
import { ok, created, ApiError } from "../utils/apiResponse.js";
import { requireString, optionalString, requireNumber, requireEnum, requireDate, requireUuidParam } from "../utils/validate.js";

const RECORD_TYPES = ["investment", "loan", "income", "other"];

function toPublic(row) {
  return {
    id: row.id,
    type: row.type,
    label: row.label,
    amount: Number(row.amount),
    recordDate: row.record_date,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

// GET /api/financial-records
export async function listRecords(req, res, next) {
  try {
    const { rows } = await query(
      "SELECT * FROM financial_records WHERE user_id = $1 ORDER BY record_date DESC, created_at DESC",
      [req.user.id]
    );
    return ok(res, { records: rows.map(toPublic) });
  } catch (err) {
    next(err);
  }
}

// POST /api/financial-records
// body: { type, label, amount, recordDate?, notes? }
export async function createRecord(req, res, next) {
  try {
    const b = req.body || {};
    const type = requireEnum(b.type, "type", RECORD_TYPES);
    const label = requireString(b.label, "label", { min: 1, max: 150 });
    const amount = requireNumber(b.amount, "amount", { min: -1e12, max: 1e12 });
    const recordDate = requireDate(b.recordDate, "recordDate") || new Date().toISOString().slice(0, 10);
    const notes = optionalString(b.notes, "notes", { max: 500 });

    const { rows } = await query(
      `INSERT INTO financial_records (user_id, type, label, amount, record_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.id, type, label, amount, recordDate, notes]
    );
    return created(res, { record: toPublic(rows[0]) }, "Financial record created.");
  } catch (err) {
    next(err);
  }
}

// PUT /api/financial-records/:id
export async function updateRecord(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const b = req.body || {};

    const fields = {
      type: b.type !== undefined ? requireEnum(b.type, "type", RECORD_TYPES) : undefined,
      label: b.label !== undefined ? requireString(b.label, "label", { min: 1, max: 150 }) : undefined,
      amount: b.amount !== undefined ? requireNumber(b.amount, "amount", { min: -1e12, max: 1e12 }) : undefined,
      record_date: b.recordDate !== undefined ? requireDate(b.recordDate, "recordDate") : undefined,
      notes: b.notes !== undefined ? optionalString(b.notes, "notes", { max: 500 }) : undefined,
    };

    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [col, val] of Object.entries(fields)) {
      if (val !== undefined) {
        setClauses.push(`${col} = $${i++}`);
        values.push(val);
      }
    }
    if (!setClauses.length) {
      throw new ApiError(400, "VALIDATION_ERROR", "No valid fields provided to update.");
    }
    setClauses.push("updated_at = now()");
    values.push(id, req.user.id);

    const { rows } = await query(
      `UPDATE financial_records SET ${setClauses.join(", ")} WHERE id = $${i++} AND user_id = $${i} RETURNING *`,
      values
    );
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Financial record not found.");
    return ok(res, { record: toPublic(rows[0]) }, "Financial record updated.");
  } catch (err) {
    next(err);
  }
}

// DELETE /api/financial-records/:id
export async function deleteRecord(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const { rows } = await query(
      "DELETE FROM financial_records WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.id]
    );
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Financial record not found.");
    return ok(res, { id }, "Financial record deleted.");
  } catch (err) {
    next(err);
  }
}

// GET /api/financial-records/summary?from=&to=
// Aggregates real sales + expenses + manual records into the numbers the
// Reports / Financial Analysis pages need — no more hardcoded sample figures.
export async function summary(req, res, next) {
  try {
    const { from, to } = req.query;
    const params = [req.user.id];
    let dateFilterSales = "";
    let dateFilterExpenses = "";
    if (from) {
      requireDate(from, "from");
      params.push(from);
      dateFilterSales += ` AND sale_date >= $${params.length}`;
      dateFilterExpenses += ` AND expense_date >= $${params.length}`;
    }
    if (to) {
      requireDate(to, "to");
      params.push(to);
      dateFilterSales += ` AND sale_date <= $${params.length}`;
      dateFilterExpenses += ` AND expense_date <= $${params.length}`;
    }

    // Growth compares the current calendar month's revenue to the previous
    // calendar month's, independent of any explicit from/to filter above
    // (which scopes the headline totals). Safe against divide-by-zero.
    const [
      { rows: salesAgg },
      { rows: expenseAgg },
      { rows: recordAgg },
      { rows: valuationRows },
      { rows: growthRows },
    ] = await Promise.all([
      query(
        `SELECT COALESCE(SUM(total_amount), 0) AS total_revenue, COUNT(*) AS sale_count
         FROM sales WHERE user_id = $1 ${dateFilterSales}`,
        params
      ),
      query(
        `SELECT COALESCE(SUM(amount), 0) AS total_expenses, COUNT(*) AS expense_count
         FROM expenses WHERE user_id = $1 ${dateFilterExpenses}`,
        params
      ),
      query(
        `SELECT type, COALESCE(SUM(amount), 0) AS total FROM financial_records
         WHERE user_id = $1 GROUP BY type`,
        [req.user.id]
      ),
      query(
        `SELECT COALESCE(SUM(quantity * cost_price), 0) AS inventory_value
         FROM inventory_items WHERE user_id = $1`,
        [req.user.id]
      ),
      query(
        `SELECT
           COALESCE(SUM(total_amount) FILTER (
             WHERE date_trunc('month', sale_date) = date_trunc('month', CURRENT_DATE)
           ), 0) AS current_month_revenue,
           COALESCE(SUM(total_amount) FILTER (
             WHERE date_trunc('month', sale_date) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
           ), 0) AS previous_month_revenue
         FROM sales WHERE user_id = $1`,
        [req.user.id]
      ),
    ]);

    const totalRevenue = Number(salesAgg[0].total_revenue);
    const totalExpenses = Number(expenseAgg[0].total_expenses);
    const netProfit = Number((totalRevenue - totalExpenses).toFixed(2));
    // profit / revenue, safely handling revenue = 0 (no NaN/Infinity).
    const profitMargin = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(2)) : 0;

    const currentMonthRevenue = Number(growthRows[0].current_month_revenue);
    const previousMonthRevenue = Number(growthRows[0].previous_month_revenue);
    // (current - previous) / previous, safely handling previous = 0.
    const growth =
      previousMonthRevenue > 0
        ? Number((((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(2))
        : currentMonthRevenue > 0
        ? 100
        : 0;

    const byType = { investment: 0, loan: 0, income: 0, other: 0 };
    for (const r of recordAgg) byType[r.type] = Number(r.total);

    return ok(res, {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalExpenses: Number(totalExpenses.toFixed(2)),
      netProfit,
      profitMargin,
      growth,
      saleCount: Number(salesAgg[0].sale_count),
      expenseCount: Number(expenseAgg[0].expense_count),
      totalInvestment: byType.investment,
      totalLoans: byType.loan,
      otherIncome: byType.income,
      otherRecords: byType.other,
      inventoryValue: Number(Number(valuationRows[0].inventory_value).toFixed(2)),
      period: { from: from || null, to: to || null },
    });
  } catch (err) {
    next(err);
  }
}
