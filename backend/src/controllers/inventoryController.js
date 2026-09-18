import { getPool, query } from "../db/pool.js";
import { ok, created, ApiError } from "../utils/apiResponse.js";
import {
  requireString,
  optionalString,
  requireNumber,
  optionalNumber,
  requireUuidParam,
} from "../utils/validate.js";

function toPublicItem(row) {
  const quantity = Number(row.quantity);
  const reorderLevel = Number(row.reorder_level);
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    category: row.category,
    unit: row.unit,
    quantity,
    costPrice: Number(row.cost_price),
    sellingPrice: Number(row.selling_price),
    reorderLevel,
    valuation: Number((quantity * Number(row.cost_price)).toFixed(2)),
    isLowStock: quantity <= reorderLevel,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toPublicTx(row) {
  return {
    id: row.id,
    itemId: row.item_id,
    itemName: row.item_name || undefined,
    type: row.type,
    quantity: Number(row.quantity),
    unitCost: row.unit_cost === null ? null : Number(row.unit_cost),
    reason: row.reason,
    quantityAfter: Number(row.quantity_after),
    createdAt: row.created_at,
  };
}

// Every query below filters by user_id = req.user.id — this is what "scoped to the
// authenticated user" means at the data layer for this resource.

// GET /api/inventory
export async function listItems(req, res, next) {
  try {
    const { rows } = await query(
      "SELECT * FROM inventory_items WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    return ok(res, { items: rows.map(toPublicItem) });
  } catch (err) {
    next(err);
  }
}

// GET /api/inventory/:id
export async function getItem(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const { rows } = await query(
      "SELECT * FROM inventory_items WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Inventory item not found.");
    return ok(res, { item: toPublicItem(rows[0]) });
  } catch (err) {
    next(err);
  }
}

// POST /api/inventory
// body: { name, sku?, category?, unit?, quantity?, costPrice?, sellingPrice?, reorderLevel? }
export async function createItem(req, res, next) {
  try {
    const b = req.body || {};
    const name = requireString(b.name, "name", { min: 1, max: 150 });
    const sku = optionalString(b.sku, "sku", { max: 60 });
    const category = optionalString(b.category, "category", { max: 80 });
    const unit = optionalString(b.unit, "unit", { max: 20 }) || "pcs";
    const quantity = optionalNumber(b.quantity, "quantity", { min: 0 }) ?? 0;
    const costPrice = optionalNumber(b.costPrice, "costPrice", { min: 0 }) ?? 0;
    const sellingPrice = optionalNumber(b.sellingPrice, "sellingPrice", { min: 0 }) ?? 0;
    const reorderLevel = optionalNumber(b.reorderLevel, "reorderLevel", { min: 0 }) ?? 0;

    const pool = getPool();
    if (!pool) {
      const err = new Error("Database is not configured. Set DATABASE_URL in the backend .env file.");
      err.code = "DB_NOT_CONFIGURED";
      throw err;
    }
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(
        `INSERT INTO inventory_items (user_id, name, sku, category, unit, quantity, cost_price, selling_price, reorder_level)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [req.user.id, name, sku, category, unit, quantity, costPrice, sellingPrice, reorderLevel]
      );
      const item = rows[0];

      if (quantity > 0) {
        await client.query(
          `INSERT INTO inventory_transactions (user_id, item_id, type, quantity, unit_cost, reason, quantity_after)
           VALUES ($1,$2,'stock_in',$3,$4,'Initial stock on item creation',$5)`,
          [req.user.id, item.id, quantity, costPrice, quantity]
        );
      }

      await client.query("COMMIT");
      return created(res, { item: toPublicItem(item) }, "Inventory item created.");
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

// PUT /api/inventory/:id  (metadata only — use stock-in/stock-out/adjust to change quantity)
export async function updateItem(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const b = req.body || {};

    const fields = {
      name: b.name !== undefined ? requireString(b.name, "name", { min: 1, max: 150 }) : undefined,
      sku: optionalString(b.sku, "sku", { max: 60 }),
      category: optionalString(b.category, "category", { max: 80 }),
      unit: optionalString(b.unit, "unit", { max: 20 }),
      cost_price: optionalNumber(b.costPrice, "costPrice", { min: 0 }),
      selling_price: optionalNumber(b.sellingPrice, "sellingPrice", { min: 0 }),
      reorder_level: optionalNumber(b.reorderLevel, "reorderLevel", { min: 0 }),
    };

    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [col, val] of Object.entries(fields)) {
      if (val !== undefined && val !== null) {
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
      `UPDATE inventory_items SET ${setClauses.join(", ")} WHERE id = $${i++} AND user_id = $${i} RETURNING *`,
      values
    );
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Inventory item not found.");
    return ok(res, { item: toPublicItem(rows[0]) }, "Inventory item updated.");
  } catch (err) {
    next(err);
  }
}

// DELETE /api/inventory/:id
export async function deleteItem(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const { rows } = await query(
      "DELETE FROM inventory_items WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.id]
    );
    if (!rows[0]) throw new ApiError(404, "NOT_FOUND", "Inventory item not found.");
    return ok(res, { id }, "Inventory item deleted.");
  } catch (err) {
    next(err);
  }
}

async function applyStockMovement({ userId, itemId, type, quantity, unitCost, reason }) {
  const pool = getPool();
  if (!pool) {
    const err = new Error("Database is not configured. Set DATABASE_URL in the backend .env file.");
    err.code = "DB_NOT_CONFIGURED";
    throw err;
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: itemRows } = await client.query(
      "SELECT * FROM inventory_items WHERE id = $1 AND user_id = $2 FOR UPDATE",
      [itemId, userId]
    );
    const item = itemRows[0];
    if (!item) throw new ApiError(404, "NOT_FOUND", "Inventory item not found.");

    const current = Number(item.quantity);
    let next_ = current;
    if (type === "stock_in") {
      next_ = current + quantity;
    } else if (type === "stock_out") {
      if (quantity > current) {
        throw new ApiError(
          400,
          "INSUFFICIENT_STOCK",
          `Cannot remove ${quantity} ${item.unit}; only ${current} in stock.`
        );
      }
      next_ = current - quantity;
    } else if (type === "adjustment") {
      next_ = quantity; // absolute set for adjustments
    }

    const { rows: updatedRows } = await client.query(
      "UPDATE inventory_items SET quantity = $1, updated_at = now() WHERE id = $2 RETURNING *",
      [next_, itemId]
    );

    const txQuantity = type === "adjustment" ? Math.abs(next_ - current) || 0.0001 : quantity;
    const { rows: txRows } = await client.query(
      `INSERT INTO inventory_transactions (user_id, item_id, type, quantity, unit_cost, reason, quantity_after)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [userId, itemId, type, txQuantity, unitCost ?? null, reason ?? null, next_]
    );

    await client.query("COMMIT");
    return { item: updatedRows[0], transaction: txRows[0] };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// POST /api/inventory/:id/stock-in
// body: { quantity, unitCost?, reason? }
export async function stockIn(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const b = req.body || {};
    const quantity = requireNumber(b.quantity, "quantity", { min: 0.0001 });
    const unitCost = optionalNumber(b.unitCost, "unitCost", { min: 0 });
    const reason = optionalString(b.reason, "reason", { max: 300 });

    const { item, transaction } = await applyStockMovement({
      userId: req.user.id,
      itemId: id,
      type: "stock_in",
      quantity,
      unitCost,
      reason,
    });
    return ok(res, { item: toPublicItem(item), transaction: toPublicTx(transaction) }, "Stock added.");
  } catch (err) {
    next(err);
  }
}

// POST /api/inventory/:id/stock-out
// body: { quantity, reason? }
export async function stockOut(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const b = req.body || {};
    const quantity = requireNumber(b.quantity, "quantity", { min: 0.0001 });
    const reason = optionalString(b.reason, "reason", { max: 300 });

    const { item, transaction } = await applyStockMovement({
      userId: req.user.id,
      itemId: id,
      type: "stock_out",
      quantity,
      reason,
    });
    return ok(res, { item: toPublicItem(item), transaction: toPublicTx(transaction) }, "Stock removed.");
  } catch (err) {
    next(err);
  }
}

// POST /api/inventory/:id/adjust  — set absolute quantity (e.g. after a physical stock count)
// body: { quantity, reason? }
export async function adjustStock(req, res, next) {
  try {
    const id = requireUuidParam(req.params.id);
    const b = req.body || {};
    const quantity = requireNumber(b.quantity, "quantity", { min: 0 });
    const reason = optionalString(b.reason, "reason", { max: 300 }) || "Manual stock adjustment";

    const { item, transaction } = await applyStockMovement({
      userId: req.user.id,
      itemId: id,
      type: "adjustment",
      quantity,
      reason,
    });
    return ok(res, { item: toPublicItem(item), transaction: toPublicTx(transaction) }, "Stock adjusted.");
  } catch (err) {
    next(err);
  }
}

// GET /api/inventory/low-stock
export async function lowStock(req, res, next) {
  try {
    const { rows } = await query(
      "SELECT * FROM inventory_items WHERE user_id = $1 AND quantity <= reorder_level ORDER BY (quantity - reorder_level) ASC",
      [req.user.id]
    );
    return ok(res, { items: rows.map(toPublicItem) });
  } catch (err) {
    next(err);
  }
}

// GET /api/inventory/valuation
export async function valuation(req, res, next) {
  try {
    const { rows } = await query(
      "SELECT * FROM inventory_items WHERE user_id = $1",
      [req.user.id]
    );
    const items = rows.map(toPublicItem);
    const totalCostValue = items.reduce((sum, it) => sum + it.quantity * it.costPrice, 0);
    const totalRetailValue = items.reduce((sum, it) => sum + it.quantity * it.sellingPrice, 0);
    return ok(res, {
      totalCostValue: Number(totalCostValue.toFixed(2)),
      totalRetailValue: Number(totalRetailValue.toFixed(2)),
      potentialProfit: Number((totalRetailValue - totalCostValue).toFixed(2)),
      itemCount: items.length,
      byItem: items.map((it) => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        costValue: Number((it.quantity * it.costPrice).toFixed(2)),
        retailValue: Number((it.quantity * it.sellingPrice).toFixed(2)),
      })),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/inventory/transactions?itemId=&limit=
export async function listTransactions(req, res, next) {
  try {
    const { itemId, limit } = req.query;
    const params = [req.user.id];
    let sql = `SELECT t.*, i.name AS item_name FROM inventory_transactions t
               LEFT JOIN inventory_items i ON i.id = t.item_id
               WHERE t.user_id = $1`;
    if (itemId) {
      requireUuidParam(itemId, "itemId");
      params.push(itemId);
      sql += ` AND t.item_id = $${params.length}`;
    }
    sql += " ORDER BY t.created_at DESC";
    const cappedLimit = Math.min(Number(limit) || 200, 500);
    params.push(cappedLimit);
    sql += ` LIMIT $${params.length}`;

    const { rows } = await query(sql, params);
    return ok(res, { transactions: rows.map(toPublicTx) });
  } catch (err) {
    next(err);
  }
}
