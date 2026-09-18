import { isDbConfigured, query } from "../db/pool.js";

/**
 * Assembles real, authenticated business context for one user, to be handed
 * to Gemini as reference DATA (never as instructions — see the STRICT RULES
 * in geminiService's system prompt). Every query here is scoped to userId;
 * this is the only place the AI layer is allowed to read business data from.
 *
 * Returns null if there's nothing to show yet (no DB, or brand-new user with
 * no profile/data) so the caller/prompt can say "not available" honestly
 * instead of the model inventing numbers.
 */
export async function getBusinessContextForUser(userId) {
  if (!userId || !isDbConfigured()) return null;

  const [profileRes, metricsRes, inventoryRes, salesRes, expensesRes] = await Promise.all([
    query("SELECT * FROM business_profiles WHERE user_id = $1", [userId]),
    query(
      `SELECT
         COALESCE((SELECT SUM(total_amount) FROM sales WHERE user_id = $1), 0) AS total_revenue,
         COALESCE((SELECT SUM(amount) FROM expenses WHERE user_id = $1), 0) AS total_expenses,
         COALESCE((SELECT SUM(quantity * cost_price) FROM inventory_items WHERE user_id = $1), 0) AS inventory_value,
         COALESCE((SELECT COUNT(*) FROM inventory_items WHERE user_id = $1 AND quantity <= reorder_level), 0) AS low_stock_count`,
      [userId]
    ),
    query(
      "SELECT name, quantity, reorder_level FROM inventory_items WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 5",
      [userId]
    ),
    query(
      "SELECT item_name, quantity, total_amount, sale_date FROM sales WHERE user_id = $1 ORDER BY sale_date DESC, created_at DESC LIMIT 5",
      [userId]
    ),
    query(
      "SELECT category, amount, expense_date FROM expenses WHERE user_id = $1 ORDER BY expense_date DESC, created_at DESC LIMIT 5",
      [userId]
    ),
  ]);

  const profile = profileRes.rows[0] || null;
  const m = metricsRes.rows[0];
  const totalRevenue = Number(m.total_revenue);
  const totalExpenses = Number(m.total_expenses);
  const netProfit = Number((totalRevenue - totalExpenses).toFixed(2));
  const profitMargin = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(2)) : null;

  const hasAnyData =
    profile || totalRevenue > 0 || totalExpenses > 0 || Number(m.inventory_value) > 0 || inventoryRes.rows.length > 0;
  if (!hasAnyData) return null;

  return {
    businessProfile: profile
      ? {
          businessName: profile.business_name,
          businessType: profile.business_type,
          village: profile.village,
          district: profile.district,
          state: profile.state,
          onboardingComplete: profile.onboarding_complete,
        }
      : null,
    metrics: {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin, // null means "not enough data" — never a fabricated number
      inventoryValue: Number(Number(m.inventory_value).toFixed(2)),
      lowStockItemCount: Number(m.low_stock_count),
    },
    recentInventory: inventoryRes.rows.map((r) => ({
      name: r.name,
      quantity: Number(r.quantity),
      reorderLevel: Number(r.reorder_level),
    })),
    recentSales: salesRes.rows.map((r) => ({
      item: r.item_name,
      quantity: Number(r.quantity),
      amount: Number(r.total_amount),
      date: r.sale_date,
    })),
    recentExpenses: expensesRes.rows.map((r) => ({
      category: r.category,
      amount: Number(r.amount),
      date: r.expense_date,
    })),
  };
}
