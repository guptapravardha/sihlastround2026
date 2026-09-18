import { getPool, query } from "../db/pool.js";
import { ok, created, ApiError } from "../utils/apiResponse.js";
import {
  requireString,
  optionalString,
  requireNumber,
  requireDate,
  requireUuidParam,
} from "../utils/validate.js";

function toPublic(row) {
  return {
    id: row.id,
    itemId: row.item_id,
    itemName: row.item_name,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    totalAmount: Number(row.total_amount),
    saleDate: row.sale_date,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

// GET /api/sales?from=&to=
export async function listSales(req, res, next) {
  try {
    const { from, to } = req.query;
    const params = [req.user.id];
    let sql = "SELECT * FROM sales WHERE user_id = $1";
    if (from) {
      requireDate(from, "from");
      params.push(from);
      sql += ` AND sale_date >= $${params.length}`;
    }
    if (to) {
      requireDate(to, "to");
      params.push(to);
      sql += ` AND sale_date <= $${params.length}`;
    }
    sql += " ORDER BY sale_date DESC, created_at DESC";
    const { rows } = await query(sql, params);
    return ok(res, { sales: rows.map(toPublic) });
  } catch (err) {
    next(err);
  }
}

// GET /api/sales/:id
export async function getSale(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const { rows } = await query("SELECT * FROM sales WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ]);
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Sale not found.");
    return ok(res, { sale: toPublic(rows[0]) });
  } catch (err) {
    next(err);
  }
}

// POST /api/sales
// body: { itemId?, itemName?, quantity, unitPrice, saleDate?, notes? }
// If itemId is given, quantity is deducted from inventory (with a matching
// inventory_transactions "stock_out" row) inside the same DB transaction —
// a sale linked to stock you don't have is rejected, not silently allowed.
export async function createSale(req, res, next) {
  try {
    const b = req.body || {};
    const quantity = requireNumber(b.quantity, "quantity", { min: 0.0001 });
    const unitPrice = requireNumber(b.unitPrice, "unitPrice", { min: 0 });
    const saleDate = requireDate(b.saleDate, "saleDate") || new Date().toISOString().slice(0, 10);
    const notes = optionalString(b.notes, "notes", { max: 500 });
    const totalAmount = Number((quantity * unitPrice).toFixed(2));

    const pool = getPool();
    if (!pool) {
      const err = new Error("Database is not configured. Set DATABASE_URL in the backend .env file.");
      err.code = "DB_NOT_CONFIGURED";
      throw err;
    }
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let itemName = optionalString(b.itemName, "itemName", { max: 150 });
      let itemId = null;

      if (b.itemId) {
        itemId = requireUuidParam(b.itemId, "itemId");
        const { rows: itemRows } = await client.query(
          "SELECT * FROM inventory_items WHERE id = $1 AND user_id = $2 FOR UPDATE",
          [itemId, req.user.id]
        );
        const item = itemRows[0];
        if (!item) throw new ApiError(404, "NOT_FOUND", "Inventory item not found.");

        const current = Number(item.quantity);
        if (quantity > current) {
          throw new ApiError(
            400,
            "INSUFFICIENT_STOCK",
            `Cannot sell ${quantity} ${item.unit}; only ${current} in stock.`
          );
        }
        const nextQty = current - quantity;
        await client.query("UPDATE inventory_items SET quantity = $1, updated_at = now() WHERE id = $2", [
          nextQty,
          itemId,
        ]);
        await client.query(
          `INSERT INTO inventory_transactions (user_id, item_id, type, quantity, unit_cost, reason, quantity_after)
           VALUES ($1,$2,'stock_out',$3,$4,'Sold',$5)`,
          [req.user.id, itemId, quantity, item.cost_price, nextQty]
        );
        itemName = itemName || item.name;
      }

      if (!itemName) {
        throw new ApiError(400, "VALIDATION_ERROR", "Provide either `itemId` or `itemName`.");
      }

      const { rows } = await client.query(
        `INSERT INTO sales (user_id, item_id, item_name, quantity, unit_price, total_amount, sale_date, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [req.user.id, itemId, itemName, quantity, unitPrice, totalAmount, saleDate, notes]
      );

      await client.query("COMMIT");
      return created(res, { sale: toPublic(rows[0]) }, "Sale recorded.");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
}

// PUT /api/sales/:id  (edits sale record fields only — does not re-touch inventory)
export async function updateSale(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const b = req.body || {};

    const fields = {
      item_name: b.itemName !== undefined ? optionalString(b.itemName, "itemName", { max: 150 }) : undefined,
      quantity: b.quantity !== undefined ? requireNumber(b.quantity, "quantity", { min: 0.0001 }) : undefined,
      unit_price: b.unitPrice !== undefined ? requireNumber(b.unitPrice, "unitPrice", { min: 0 }) : undefined,
      sale_date: b.saleDate !== undefined ? requireDate(b.saleDate, "saleDate") : undefined,
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
    if (fields.quantity !== undefined || fields.unit_price !== undefined) {
      // total_amount must stay consistent; recompute using whichever values are final.
      setClauses.push(
        `total_amount = ROUND(COALESCE($${i}, quantity) * COALESCE($${i + 1}, unit_price), 2)`
      );
      values.push(fields.quantity ?? null, fields.unit_price ?? null);
      i += 2;
    }
    if (!setClauses.length) {
      throw new ApiError(400, "VALIDATION_ERROR", "No valid fields provided to update.");
    }
    setClauses.push("updated_at = now()");
    values.push(id, req.user.id);

    const { rows } = await query(
      `UPDATE sales SET ${setClauses.join(", ")} WHERE id = $${i++} AND user_id = $${i} RETURNING *`,
      values
    );
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Sale not found.");
    return ok(res, { sale: toPublic(rows[0]) }, "Sale updated.");
  } catch (err) {
    next(err);
  }
}

// DELETE /api/sales/:id
export async function deleteSale(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const { rows } = await query("DELETE FROM sales WHERE id = $1 AND user_id = $2 RETURNING id", [
      id,
      req.user.id,
    ]);
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Sale not found.");
    return ok(res, { id }, "Sale deleted.");
  } catch (err) {
    next(err);
  }
}
