import { verifyToken } from "../utils/authUtils.js";
import { ApiError } from "../utils/apiResponse.js";

// Attaches req.user = { id, email } for any request bearing a valid JWT.
// Every route that touches a private resource (business profile, inventory,
// sales, expenses, financial records) must use this, and every DB query in
// those controllers must filter by req.user.id — this middleware only proves
// *who* is asking, controllers are responsible for scoping *what* they can see.
export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "UNAUTHORIZED", "Missing or malformed Authorization header.");
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      throw new ApiError(401, "INVALID_TOKEN", "Session expired or invalid. Please log in again.");
    }

    if (!decoded?.sub) {
      throw new ApiError(401, "INVALID_TOKEN", "Session expired or invalid. Please log in again.");
    }

    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch (err) {
    next(err);
  }
}

// Same as requireAuth but never rejects the request: if a valid Bearer token
// is present, req.user is populated; otherwise the request proceeds as
// anonymous (req.user stays undefined). Used by routes like /api/ai/chat
// that must keep working for logged-out/pre-onboarding users (existing voice
// advisor UX) but should attach real business context when the user *is*
// authenticated.
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    if (decoded?.sub) {
      req.user = { id: decoded.sub, email: decoded.email };
    }
  } catch {
    // Invalid/expired token on an optional-auth route: treat as anonymous
    // rather than failing the whole request.
  }
  next();
}
