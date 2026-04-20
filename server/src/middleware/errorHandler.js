export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  const isProd = process.env.NODE_ENV === "production";
  const details = isProd ? null : err.stack;

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
