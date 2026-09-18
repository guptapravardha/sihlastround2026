-- Gram-Pragati AI — Phase 2 schema
-- Postgres / Supabase. Every private table carries a user_id owner column
-- and every query in the app layer filters by it (defense in depth; if the
-- project is later moved fully onto Supabase Auth, these also work as the
-- basis for row-level-security policies).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ========== USERS ==========
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  mobile        TEXT,
  password_hash TEXT NOT NULL,
  language      TEXT NOT NULL DEFAULT 'English',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== BUSINESS PROFILE (one per user) ==========
CREATE TABLE IF NOT EXISTS business_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name   TEXT,
  business_type   TEXT,
  village         TEXT,
  district        TEXT,
  state           TEXT,
  budget_range    TEXT,
  experience      TEXT,
  interest        TEXT,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== INVENTORY ITEMS ==========
CREATE TABLE IF NOT EXISTS inventory_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  sku           TEXT,
  category      TEXT,
  unit          TEXT NOT NULL DEFAULT 'pcs',
  quantity      NUMERIC NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  cost_price    NUMERIC NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
  selling_price NUMERIC NOT NULL DEFAULT 0 CHECK (selling_price >= 0),
  reorder_level NUMERIC NOT NULL DEFAULT 0 CHECK (reorder_level >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inventory_items_user ON inventory_items(user_id);

-- ========== INVENTORY TRANSACTIONS (stock in / stock out / adjustment) ==========
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id       UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('stock_in', 'stock_out', 'adjustment')),
  quantity      NUMERIC NOT NULL CHECK (quantity > 0),
  unit_cost     NUMERIC, -- cost/price applicable to this movement, for valuation history
  reason        TEXT,
  quantity_after NUMERIC NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_user ON inventory_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_item ON inventory_transactions(item_id);

-- ========== SALES ==========
CREATE TABLE IF NOT EXISTS sales (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id       UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  item_name     TEXT NOT NULL, -- snapshot, survives item deletion
  quantity      NUMERIC NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC NOT NULL CHECK (unit_price >= 0),
  total_amount  NUMERIC NOT NULL CHECK (total_amount >= 0),
  sale_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sales_user ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);

-- ========== EXPENSES ==========
CREATE TABLE IF NOT EXISTS expenses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category      TEXT NOT NULL,
  description   TEXT,
  amount        NUMERIC NOT NULL CHECK (amount >= 0),
  expense_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

-- ========== FINANCIAL RECORDS (manual entries: investment, loan, other) ==========
CREATE TABLE IF NOT EXISTS financial_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('investment', 'loan', 'income', 'other')),
  label         TEXT NOT NULL,
  amount        NUMERIC NOT NULL,
  record_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_financial_records_user ON financial_records(user_id);
