import { query } from "../db/pool.js";
import { hashPassword, comparePassword, signToken } from "../utils/authUtils.js";
import { ok, created, ApiError } from "../utils/apiResponse.js";
import { requireString, optionalString, isValidEmail } from "../utils/validate.js";

function toPublicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    mobile: row.mobile,
    language: row.language,
    createdAt: row.created_at,
  };
}

// POST /api/auth/register
// body: { name, email, password, mobile?, language? }
export async function register(req, res, next) {
  try {
    const body = req.body || {};
    const name = requireString(body.name, "name", { min: 2, max: 120 });
    const password = requireString(body.password, "password", { min: 6, max: 200 });
    const mobile = optionalString(body.mobile, "mobile", { max: 20 });
    const language = optionalString(body.language, "language", { max: 30 }) || "English";

    if (!isValidEmail(body.email)) {
      throw new ApiError(400, "VALIDATION_ERROR", "`email` must be a valid email address.");
    }
    const email = body.email.trim().toLowerCase();

    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length) {
      throw new ApiError(409, "ALREADY_EXISTS", "An account with this email already exists.");
    }

    const passwordHash = await hashPassword(password);
    const { rows } = await query(
      `INSERT INTO users (name, email, mobile, password_hash, language)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, mobile, language, created_at`,
      [name, email, mobile, passwordHash, language]
    );
    const user = rows[0];

    // Create an empty business profile row up front so later PUT /api/business-profile
    // (from onboarding) is always an update, never a race to insert.
    await query(
      `INSERT INTO business_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
      [user.id]
    );

    const token = signToken({ sub: user.id, email: user.email });
    return created(res, { token, user: toPublicUser(user) }, "Account created.");
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
// body: { email, password }
export async function login(req, res, next) {
  try {
    const body = req.body || {};
    if (!isValidEmail(body.email)) {
      throw new ApiError(400, "VALIDATION_ERROR", "`email` must be a valid email address.");
    }
    const password = requireString(body.password, "password", { min: 1, max: 200 });
    const email = body.email.trim().toLowerCase();

    const { rows } = await query(
      "SELECT id, name, email, mobile, language, password_hash, created_at FROM users WHERE email = $1",
      [email]
    );
    const user = rows[0];
    if (!user) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }

    const token = signToken({ sub: user.id, email: user.email });
    return ok(res, { token, user: toPublicUser(user) }, "Login successful.");
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
export async function me(req, res, next) {
  try {
    const { rows } = await query(
      "SELECT id, name, email, mobile, language, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (!rows[0]) {
      throw new ApiError(404, "NOT_FOUND", "User not found.");
    }
    return ok(res, { user: toPublicUser(rows[0]) });
  } catch (err) {
    next(err);
  }
}
