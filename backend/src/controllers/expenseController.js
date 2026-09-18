import { query } from "../db/pool.js";
import { ok, created, ApiError } from "../utils/apiResponse.js";
import { requireString, optionalString, requireNumber, requireDate, requireUuidParam } from "../utils/validate.js";

function toPublic(row) {
  return {
    id: row.id,
    category: row.category,
    description: row.description,
    amount: Number(row.amount),
    expenseDate: row.expense_date,
    createdAt: row.created_at,
  };
}

// GET /api/expenses?from=&to=&category=
export async function listExpenses(req, res, next) {
  try {
    const { from, to, category } = req.query;
    const params = [req.user.id];
    let sql = "SELECT * FROM expenses WHERE user_id = $1";
    if (from) {
      requireDate(from, "from");
      params.push(from);
      sql += ` AND expense_date >= $${params.length}`;
    }
    if (to) {
      requireDate(to, "to");
      params.push(to);
      sql += ` AND expense_date <= $${params.length}`;
    }
    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    sql += " ORDER BY expense_date DESC, created_at DESC";
    const { rows } = await query(sql, params);
    return ok(res, { expenses: rows.map(toPublic) });
  } catch (err) {
    next(err);
  }
}

// GET /api/expenses/:id
export async function getExpense(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const { rows } = await query("SELECT * FROM expenses WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ]);
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Expense not found.");
    return ok(res, { expense: toPublic(rows[0]) });
  } catch (err) {
    next(err);
  }
}

// POST /api/expenses
// body: { category, amount, description?, expenseDate? }
export async function createExpense(req, res, next) {
  try {
    const b = req.body || {};
    const category = requireString(b.category, "category", { min: 1, max: 80 });
    const amount = requireNumber(b.amount, "amount", { min: 0 });
    const description = optionalString(b.description, "description", { max: 300 });
    const expenseDate = requireDate(b.expenseDate, "expenseDate") || new Date().toISOString().slice(0, 10);

    const { rows } = await query(
      `INSERT INTO expenses (user_id, category, description, amount, expense_date)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.id, category, description, amount, expenseDate]
    );
    return created(res, { expense: toPublic(rows[0]) }, "Expense recorded.");
  } catch (err) {
    next(err);
  }
}

// PUT /api/expenses/:id
export async function updateExpense(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const b = req.body || {};

    const fields = {
      category: b.category !== undefined ? requireString(b.category, "category", { min: 1, max: 80 }) : undefined,
      description: b.description !== undefined ? optionalString(b.description, "description", { max: 300 }) : undefined,
      amount: b.amount !== undefined ? requireNumber(b.amount, "amount", { min: 0 }) : undefined,
      expense_date: b.expenseDate !== undefined ? requireDate(b.expenseDate, "expenseDate") : undefined,
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
      `UPDATE expenses SET ${setClauses.join(", ")} WHERE id = $${i++} AND user_id = $${i} RETURNING *`,
      values
    );
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Expense not found.");
    return ok(res, { expense: toPublic(rows[0]) }, "Expense updated.");
  } catch (err) {
    next(err);
  }
}

// DELETE /api/expenses/:id
export async function deleteExpense(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const { rows } = await query("DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id", [
      id,
      req.user.id,
    ]);
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Expense not found.");
    return ok(res, { id }, "Expense deleted.");
  } catch (err) {
    next(err);
  }
}
