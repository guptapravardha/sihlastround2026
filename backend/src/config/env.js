import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Dev convenience: if no JWT_SECRET is configured, generate an ephemeral one so the
// server can still boot and auth still works within a single process lifetime.
// Tokens become invalid on restart, and this is NOT safe for production —
// always set a real JWT_SECRET in .env for any persistent/deployed environment.
let effectiveJwtSecret = process.env.JWT_SECRET || "";
if (!effectiveJwtSecret) {
  effectiveJwtSecret = crypto.randomBytes(32).toString("hex");
  console.warn(
    "[env] JWT_SECRET not set — using a random ephemeral secret for this process only. " +
      "Set JWT_SECRET in backend/.env for real use (tokens will invalidate on every restart otherwise)."
  );
}

export const env = {
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  },

  bhashini: {
    apiKey: process.env.BHASHINI_API_KEY || "",
    userId: process.env.BHASHINI_USER_ID || "",
    ulcaApiKey: process.env.BHASHINI_ULCA_API_KEY || "",
    pipelineId: process.env.BHASHINI_PIPELINE_ID || "",
  },

  databaseUrl: process.env.DATABASE_URL || "",
  databaseSsl: (process.env.DATABASE_SSL || "true") !== "false",

  jwtSecret: effectiveJwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

export const isGeminiConfigured = () => Boolean(env.gemini.apiKey);
export const isBhashiniConfigured = () =>
  Boolean(env.bhashini.apiKey && env.bhashini.userId && env.bhashini.ulcaApiKey);
export const isDbConfigured = () => Boolean(env.databaseUrl);
export const isJwtConfigured = () => Boolean(process.env.JWT_SECRET);
