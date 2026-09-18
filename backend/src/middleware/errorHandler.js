import { ApiError } from "../utils/apiResponse.js";

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: `Route ${req.originalUrl} not found` },
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === "production";

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }

  if (err.code === "DB_NOT_CONFIGURED") {
    return res.status(503).json({
      success: false,
      error: { code: "DB_NOT_CONFIGURED", message: err.message },
    });
  }

  // Postgres unique_violation (e.g. duplicate email)
  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      error: { code: "ALREADY_EXISTS", message: "This record already exists." },
    });
  }

  console.error("[UNHANDLED ERROR]", err);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: isProd ? "Something went wrong. Please try again." : err.message,
    },
  });
}
