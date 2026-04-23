// ── 404 Not Found Handler ───────────────────────────────────────────────
// Catch-all middleware registered after all routes.
// If a request reaches here, no route matched — so we create a 404 error
// and forward it to the global errorHandler via next(error).
export function apiNotFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;  // Attach status so errorHandler uses it
  next(error);  // Delegate to errorHandler
}
