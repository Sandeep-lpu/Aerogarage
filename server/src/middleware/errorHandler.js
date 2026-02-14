export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  const isProd = process.env.NODE_ENV === "production";
  const details = isProd ? null : err.stack;

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: details,
  });
}
