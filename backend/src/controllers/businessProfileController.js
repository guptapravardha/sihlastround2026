import { query } from "../db/pool.js";
import { ok, ApiError } from "../utils/apiResponse.js";
import { optionalString } from "../utils/validate.js";

function toPublic(row) {
  return {
    businessName: row.business_name,
    businessType: row.business_type,
    village: row.village,
    district: row.district,
    state: row.state,
    budgetRange: row.budget_range,
    experience: row.experience,
    interest: row.interest,
    onboardingComplete: row.onboarding_complete,
    updatedAt: row.updated_at,
  };
}

// GET /api/business-profile
export async function getProfile(req, res, next) {
  try {
    const { rows } = await query(
      "SELECT * FROM business_profiles WHERE user_id = $1",
      [req.user.id]
    );
    if (!rows[0]) {
      throw new ApiError(404, "NOT_FOUND", "Business profile not found.");
    }
    return ok(res, { profile: toPublic(rows[0]) });
  } catch (err) {
    next(err);
  }
}

// PUT /api/business-profile
// body: { businessName?, businessType?, village?, district?, state?, budgetRange?, experience?, interest?, onboardingComplete? }
export async function updateProfile(req, res, next) {
  try {
    const b = req.body || {};
    const fields = {
      business_name: optionalString(b.businessName, "businessName", { max: 150 }),
      business_type: optionalString(b.businessType, "businessType", { max: 100 }),
      village: optionalString(b.village, "village", { max: 100 }),
      district: optionalString(b.district, "district", { max: 100 }),
      state: optionalString(b.state, "state", { max: 100 }),
      budget_range: optionalString(b.budgetRange, "budgetRange", { max: 60 }),
      experience: optionalString(b.experience, "experience", { max: 60 }),
      interest: optionalString(b.interest, "interest", { max: 100 }),
    };

    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [col, val] of Object.entries(fields)) {
      if (val !== null) {
        setClauses.push(`${col} = $${i++}`);
        values.push(val);
      }
    }
    if (typeof b.onboardingComplete === "boolean") {
      setClauses.push(`onboarding_complete = $${i++}`);
      values.push(b.onboardingComplete);
    }

    if (!setClauses.length) {
      throw new ApiError(400, "VALIDATION_ERROR", "No valid fields provided to update.");
    }

    setClauses.push(`updated_at = now()`);
    values.push(req.user.id);

    const { rows } = await query(
      `UPDATE business_profiles SET ${setClauses.join(", ")} WHERE user_id = $${i} RETURNING *`,
      values
    );

    if (!rows[0]) {
      // Shouldn't normally happen (row is created at registration), but self-heal if missing.
      const insertCols = ["user_id", ...Object.keys(fields)];
      const insertVals = [req.user.id, ...Object.values(fields)];
      const placeholders = insertVals.map((_, idx) => `$${idx + 1}`).join(", ");
      const inserted = await query(
        `INSERT INTO business_profiles (${insertCols.join(", ")}) VALUES (${placeholders}) RETURNING *`,
        insertVals
      );
      return ok(res, { profile: toPublic(inserted.rows[0]) }, "Business profile created.");
    }

    return ok(res, { profile: toPublic(rows[0]) }, "Business profile updated.");
  } catch (err) {
    next(err);
  }
}
