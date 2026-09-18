import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";
import { getPool, isDbConfigured } from "../db/pool.js";

// These tests exercise the real HTTP layer against a real Postgres database.
// Run `npm run migrate` against a disposable test database and set
// DATABASE_URL to it before running `npm test`. If no DB is configured the
// suite skips (rather than failing CI environments that only run unit-level
// checks) — this file is the integration layer.
const RUN = isDbConfigured();

let server;
let baseUrl;

before(async () => {
  if (!RUN) return;
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) await new Promise((r) => server.close(r));
  const pool = getPool();
  if (pool) await pool.end();
});

async function api(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

test("auth: register -> login -> me, and duplicate email is rejected", { skip: !RUN }, async () => {
  const email = `test_${Date.now()}@example.com`;
  const reg = await api("/api/auth/register", {
    method: "POST",
    body: { name: "Test User", email, password: "secret123" },
  });
  assert.equal(reg.status, 201);
  assert.ok(reg.json.data.token);

  const dup = await api("/api/auth/register", {
    method: "POST",
    body: { name: "Test User 2", email, password: "secret123" },
  });
  assert.equal(dup.status, 409);

  const login = await api("/api/auth/login", {
    method: "POST",
    body: { email, password: "secret123" },
  });
  assert.equal(login.status, 200);

  const me = await api("/api/auth/me", { token: login.json.data.token });
  assert.equal(me.status, 200);
  assert.equal(me.json.data.user.email, email);
});

test("routes require auth", { skip: !RUN }, async () => {
  const res = await api("/api/inventory");
  assert.equal(res.status, 401);
});

test("inventory: create, stock in/out, low-stock, valuation, transactions, isolation", { skip: !RUN }, async () => {
  const email = `inv_${Date.now()}@example.com`;
  const reg = await api("/api/auth/register", {
    method: "POST",
    body: { name: "Inv User", email, password: "secret123" },
  });
  const token = reg.json.data.token;

  const create = await api("/api/inventory", {
    method: "POST",
    token,
    body: { name: "Test Item", quantity: 10, costPrice: 5, sellingPrice: 8, reorderLevel: 5 },
  });
  assert.equal(create.status, 201);
  const itemId = create.json.data.item.id;
  assert.equal(create.json.data.item.isLowStock, false);

  const stockOut = await api(`/api/inventory/${itemId}/stock-out`, {
    method: "POST",
    token,
    body: { quantity: 8 },
  });
  assert.equal(stockOut.status, 200);
  assert.equal(stockOut.json.data.item.quantity, 2);
  assert.equal(stockOut.json.data.item.isLowStock, true);

  const overSell = await api(`/api/inventory/${itemId}/stock-out`, {
    method: "POST",
    token,
    body: { quantity: 999 },
  });
  assert.equal(overSell.status, 400);
  assert.equal(overSell.json.error.code, "INSUFFICIENT_STOCK");

  const low = await api("/api/inventory/low-stock", { token });
  assert.equal(low.json.data.items.length, 1);

  const val = await api("/api/inventory/valuation", { token });
  assert.equal(val.json.data.totalCostValue, 10); // 2 units * costPrice 5

  const txs = await api(`/api/inventory/transactions?itemId=${itemId}`, { token });
  assert.equal(txs.json.data.transactions.length, 2); // initial stock_in + stock_out

  // Cross-user isolation
  const reg2 = await api("/api/auth/register", {
    method: "POST",
    body: { name: "Other User", email: `other_${Date.now()}@example.com`, password: "secret123" },
  });
  const otherToken = reg2.json.data.token;
  const leaked = await api(`/api/inventory/${itemId}`, { token: otherToken });
  assert.equal(leaked.status, 404);
});

test("sales linked to inventory deduct stock; expenses and summary aggregate correctly", { skip: !RUN }, async () => {
  const email = `sale_${Date.now()}@example.com`;
  const reg = await api("/api/auth/register", {
    method: "POST",
    body: { name: "Sale User", email, password: "secret123" },
  });
  const token = reg.json.data.token;

  const item = await api("/api/inventory", {
    method: "POST",
    token,
    body: { name: "Sellable", quantity: 10, costPrice: 2, sellingPrice: 5, reorderLevel: 1 },
  });
  const itemId = item.json.data.item.id;

  const sale = await api("/api/sales", {
    method: "POST",
    token,
    body: { itemId, quantity: 4, unitPrice: 5 },
  });
  assert.equal(sale.status, 201);
  assert.equal(sale.json.data.sale.totalAmount, 20);

  const afterSale = await api(`/api/inventory/${itemId}`, { token });
  assert.equal(afterSale.json.data.item.quantity, 6);

  await api("/api/expenses", { method: "POST", token, body: { category: "Rent", amount: 5 } });

  const summary = await api("/api/financial-records/summary", { token });
  assert.equal(summary.json.data.totalRevenue, 20);
  assert.equal(summary.json.data.totalExpenses, 5);
  assert.equal(summary.json.data.netProfit, 15);
});
