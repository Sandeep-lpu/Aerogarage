// ── Global Error Handler Middleware ──────────────────────────────────────────
// Express's 4-argument middleware signature (err, req, res, next) is what makes
// this a dedicated error handler. It MUST be registered last in the middleware chain.
// All errors thrown or passed via next(err) anywhere in the app land here.
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;  // Default to 500 if not set
  const message = err.message || "Internal server error";

  // In production, never expose stack traces to the client for security reasons
  const isProd = process.env.NODE_ENV === "production";
  const details = isProd ? null : err.stack;  // Only include stack in development

  // Use res.fail() if responseFormatter has already attached it; otherwise write raw JSON
  // (res.fail may not exist if the error occurs before responseFormatter middleware)
  if (typeof res.fail === "function") {
    return res.fail(message, statusCode, details);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: details,
  });
}
