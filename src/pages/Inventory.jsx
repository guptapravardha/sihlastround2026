import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, TrendingUp, TrendingDown, AlertTriangle, Trash2, History } from "lucide-react";
import { api } from "../services/apiClient";

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  unit: "pcs",
  quantity: "",
  costPrice: "",
  sellingPrice: "",
  reorderLevel: "",
};

export default function Inventory() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [movementFor, setMovementFor] = useState(null); // item id currently doing stock in/out
  const [movementQty, setMovementQty] = useState("");
  const [historyFor, setHistoryFor] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [itemsRes, valRes] = await Promise.all([api.listInventory(), api.valuation()]);
      setItems(itemsRes.items);
      setValuation(valRes);
    } catch (err) {
      setError(err.message || "Could not load inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.createInventoryItem({
        name: form.name,
        sku: form.sku || undefined,
        category: form.category || undefined,
        unit: form.unit || "pcs",
        quantity: form.quantity === "" ? 0 : Number(form.quantity),
        costPrice: form.costPrice === "" ? 0 : Number(form.costPrice),
        sellingPrice: form.sellingPrice === "" ? 0 : Number(form.sellingPrice),
        reorderLevel: form.reorderLevel === "" ? 0 : Number(form.reorderLevel),
      });
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message || "Could not create item.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inventory item? This cannot be undone.")) return;
    setError("");
    try {
      await api.deleteInventoryItem(id);
      await load();
    } catch (err) {
      setError(err.message || "Could not delete item.");
    }
  };

  const handleMovement = async (id, type) => {
    const qty = Number(movementQty);
    if (!qty || qty <= 0) {
      setError("Enter a quantity greater than 0.");
      return;
    }
    setError("");
    try {
      if (type === "in") await api.stockIn(id, { quantity: qty });
      else await api.stockOut(id, { quantity: qty });
      setMovementFor(null);
      setMovementQty("");
      await load();
    } catch (err) {
      setError(err.message || "Stock update failed.");
    }
  };

  const openHistory = async (id) => {
    setHistoryFor(id);
    try {
      const { transactions: txs } = await api.inventoryTransactions(id);
      setTransactions(txs);
    } catch (err) {
      setError(err.message || "Could not load transaction history.");
    }
  };

  return (
    <div className="local-page">
      <nav className="local-navbar">
        <button className="icon-button" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={22} />
        </button>
        <div className="local-logo">
          <span>📦</span>
          <strong>Inventory</strong>
        </div>
        <button className="primary-button" onClick={() => setShowForm((s) => !s)} style={{ padding: "8px 14px" }}>
          <Plus size={16} /> Add Item
        </button>
      </nav>

      <main className="local-container">
        {error && (
          <div className="local-warning" style={{ marginBottom: 16 }}>
            <AlertTriangle size={18} />
            <p>{error}</p>
          </div>
        )}

        {valuation && (
          <section className="pulse-grid">
            <div className="pulse-card">
              <span>Total Cost Value</span>
              <h2>₹{valuation.totalCostValue.toLocaleString("en-IN")}</h2>
            </div>
            <div className="pulse-card">
              <span>Total Retail Value</span>
              <h2>₹{valuation.totalRetailValue.toLocaleString("en-IN")}</h2>
            </div>
            <div className="pulse-card">
              <span>Potential Profit</span>
              <h2>₹{valuation.potentialProfit.toLocaleString("en-IN")}</h2>
            </div>
          </section>
        )}

        {showForm && (
          <section className="local-section">
            <div className="section-heading">
              <h2>New Inventory Item</h2>
            </div>
            <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <input placeholder="Item name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="SKU (optional)" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <input placeholder="Unit (pcs, kg, l...)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              <input placeholder="Opening quantity" type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              <input placeholder="Cost price (₹)" type="number" min="0" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
              <input placeholder="Selling price (₹)" type="number" min="0" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
              <input placeholder="Reorder level" type="number" min="0" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />
              <button className="primary-button" type="submit" style={{ gridColumn: "span 2" }}>Save Item</button>
            </form>
          </section>
        )}

        <section className="local-section">
          <div className="section-heading">
            <h2>Your Items</h2>
            <p>{loading ? "Loading..." : `${items.length} item(s)`}</p>
          </div>

          <div className="business-list">
            {items.map((item) => (
              <div className="business-card" key={item.id} style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}>
                <div className="business-main" style={{ justifyContent: "space-between", width: "100%" }}>
                  <div>
                    <h3>
                      {item.name} {item.isLowStock && <span className="opportunity-tag" style={{ background: "#fee2e2", color: "#b91c1c" }}>Low Stock</span>}
                    </h3>
                    <div className="business-details">
                      <span>Qty: <strong>{item.quantity} {item.unit}</strong></span>
                      <span>Cost: <strong>₹{item.costPrice}</strong></span>
                      <span>Sell: <strong>₹{item.sellingPrice}</strong></span>
                      <span>Value: <strong>₹{item.valuation}</strong></span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="icon-button" title="History" onClick={() => openHistory(item.id)}>
                      <History size={18} />
                    </button>
                    <button className="icon-button" title="Delete" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {movementFor === item.id ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="number"
                      min="0"
                      placeholder="Quantity"
                      value={movementQty}
                      onChange={(e) => setMovementQty(e.target.value)}
                      style={{ maxWidth: 120 }}
                    />
                    <button className="primary-button" onClick={() => handleMovement(item.id, "in")}>
                      <TrendingUp size={16} /> Stock In
                    </button>
                    <button className="primary-button" onClick={() => handleMovement(item.id, "out")}>
                      <TrendingDown size={16} /> Stock Out
                    </button>
                    <button className="back-button" onClick={() => { setMovementFor(null); setMovementQty(""); }}>Cancel</button>
                  </div>
                ) : (
                  <button className="change-location" onClick={() => setMovementFor(item.id)}>
                    Adjust Stock
                  </button>
                )}

                {historyFor === item.id && (
                  <div style={{ background: "#f8fafc", borderRadius: 8, padding: 10 }}>
                    <strong>Recent transactions</strong>
                    <ul style={{ marginTop: 6, fontSize: 13 }}>
                      {transactions.length === 0 && <li>No transactions yet.</li>}
                      {transactions.map((t) => (
                        <li key={t.id}>
                          {new Date(t.createdAt).toLocaleString()} — {t.type} {t.quantity} (after: {t.quantityAfter}) {t.reason ? `— ${t.reason}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {!loading && items.length === 0 && <p>No inventory items yet. Add your first one above.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
