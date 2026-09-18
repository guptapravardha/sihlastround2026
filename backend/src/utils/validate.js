import { ApiError } from "./apiResponse.js";

export function requireString(value, field, { min = 1, max = 500 } = {}) {
  if (typeof value !== "string" || value.trim().length < min || value.length > max) {
    throw new ApiError(400, "VALIDATION_ERROR", `\`${field}\` must be a string (${min}-${max} chars).`);
  }
  return value.trim();
}

export function optionalString(value, field, { max = 500 } = {}) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > max) {
    throw new ApiError(400, "VALIDATION_ERROR", `\`${field}\` must be a string (max ${max} chars).`);
  }
  return value.trim();
}

export function requireNumber(value, field, { min = -Infinity, max = Infinity } = {}) {
  const n = typeof value === "string" ? Number(value) : value;
  if (typeof n !== "number" || Number.isNaN(n) || n < min || n > max) {
    throw new ApiError(400, "VALIDATION_ERROR", `\`${field}\` must be a number between ${min} and ${max}.`);
  }
  return n;
}

export function optionalNumber(value, field, opts = {}) {
  if (value === undefined || value === null || value === "") return null;
  return requireNumber(value, field, opts);
}

export function requireEnum(value, field, allowed) {
  if (!allowed.includes(value)) {
    throw new ApiError(400, "VALIDATION_ERROR", `\`${field}\` must be one of: ${allowed.join(", ")}.`);
  }
  return value;
}

export function requireDate(value, field) {
  if (value === undefined || value === null || value === "") {
    return null; // caller can default to today
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new ApiError(400, "VALIDATION_ERROR", `\`${field}\` must be a valid date (YYYY-MM-DD).`);
  }
  return value;
}

export function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function requireUuidParam(value, field = "id") {
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(value)) {
    throw new ApiError(400, "VALIDATION_ERROR", `\`${field}\` must be a valid id.`);
  }
  return value;
}
