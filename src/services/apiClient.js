const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "gp_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Authenticated JSON request helper for the Phase 2 REST API
 * (auth, business-profile, inventory, sales, expenses, financial-records).
 * Throws an Error with `.code` and `.status` on any non-success response.
 */
export async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await parseJsonSafe(response);

  if (!response.ok || !json?.success) {
    const error = new Error(json?.error?.message || "Something went wrong. Please try again.");
    error.code = json?.error?.code || "UNKNOWN_ERROR";
    error.status = response.status;
    throw error;
  }

  return json.data;
}

export const api = {
  // Auth
  register: (payload) => apiRequest("/api/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => apiRequest("/api/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => apiRequest("/api/auth/me"),

  // Business profile
  getBusinessProfile: () => apiRequest("/api/business-profile"),
  updateBusinessProfile: (payload) => apiRequest("/api/business-profile", { method: "PUT", body: payload }),

  // Inventory
  listInventory: () => apiRequest("/api/inventory"),
  getInventoryItem: (id) => apiRequest(`/api/inventory/${id}`),
  createInventoryItem: (payload) => apiRequest("/api/inventory", { method: "POST", body: payload }),
  updateInventoryItem: (id, payload) => apiRequest(`/api/inventory/${id}`, { method: "PUT", body: payload }),
  deleteInventoryItem: (id) => apiRequest(`/api/inventory/${id}`, { method: "DELETE" }),
  stockIn: (id, payload) => apiRequest(`/api/inventory/${id}/stock-in`, { method: "POST", body: payload }),
  stockOut: (id, payload) => apiRequest(`/api/inventory/${id}/stock-out`, { method: "POST", body: payload }),
  adjustStock: (id, payload) => apiRequest(`/api/inventory/${id}/adjust`, { method: "POST", body: payload }),
  lowStock: () => apiRequest("/api/inventory/low-stock"),
  valuation: () => apiRequest("/api/inventory/valuation"),
  inventoryTransactions: (itemId) =>
    apiRequest(`/api/inventory/transactions${itemId ? `?itemId=${itemId}` : ""}`),

  // Sales
  listSales: () => apiRequest("/api/sales"),
  createSale: (payload) => apiRequest("/api/sales", { method: "POST", body: payload }),
  deleteSale: (id) => apiRequest(`/api/sales/${id}`, { method: "DELETE" }),

  // Expenses
  listExpenses: () => apiRequest("/api/expenses"),
  createExpense: (payload) => apiRequest("/api/expenses", { method: "POST", body: payload }),
  deleteExpense: (id) => apiRequest(`/api/expenses/${id}`, { method: "DELETE" }),

  // Financial records
  listFinancialRecords: () => apiRequest("/api/financial-records"),
  createFinancialRecord: (payload) => apiRequest("/api/financial-records", { method: "POST", body: payload }),
  financialSummary: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/api/financial-records/summary${qs ? `?${qs}` : ""}`);
  },
};
