import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

let pool = null;

// Lazily created so the server can still boot (e.g. for /api/health, /api/ai/*)
// even if DATABASE_URL isn't set yet — only DB-backed routes will fail.
export function getPool() {
  if (!env.databaseUrl) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl,
      // Supabase/managed Postgres typically requires SSL; allow opting out for local dev.
      ssl: env.databaseSsl ? { rejectUnauthorized: false } : false,
      max: 10,
    });
  }
  return pool;
}

export async function query(text, params) {
  const p = getPool();
  if (!p) {
    const err = new Error(
      "Database is not configured. Set DATABASE_URL in the backend .env file."
    );
    err.code = "DB_NOT_CONFIGURED";
    throw err;
  }
  return p.query(text, params);
}

export function isDbConfigured() {
  return Boolean(env.databaseUrl);
}
