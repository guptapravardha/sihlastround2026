export function ok(res, data, message = "") {
  return res.status(200).json({ success: true, data, message });
}

export function created(res, data, message = "") {
  return res.status(201).json({ success: true, data, message });
}

export class ApiError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function fail(res, statusCode, code, message) {
  return res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}
