// ── Input Sanitization Middleware ──────────────────────────────────────────
// Protects against MongoDB NoSQL injection by:
//   1. Stripping keys that start with "$" (MongoDB operators like $where, $gt)
//   2. Stripping keys containing "." (dot-notation path traversal)
//   3. Removing null bytes (\u0000) from strings, which can bypass filters
// Applied globally to req.body, req.query, and req.params.
function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (!value || typeof value !== "object") {
    if (typeof value === "string") {
      return value.replace(/\u0000/g, "").trim();
    }
    return value;
  }

  const next = {};
  for (const [key, child] of Object.entries(value)) {
    // Skip MongoDB operator keys and dot-notation keys to prevent injection
    if (key.startsWith("$") || key.includes(".")) continue;
    next[key] = sanitizeValue(child);
  }
  return next;
}

// sanitizeObjectInPlace — cleans an object while keeping the same reference.
// This is needed for req.query and req.params which Express keeps by reference.
function sanitizeObjectInPlace(target) {
  if (!target || typeof target !== "object") return;
  const clean = sanitizeValue(target);
  for (const key of Object.keys(target)) {
    delete target[key];
  }
  Object.assign(target, clean);
}

// sanitizeInput — Express middleware that sanitizes all incoming request data.
// Must be registered early in the middleware chain, before route handlers.
export function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === "object") {
    sanitizeObjectInPlace(req.query);
  }
  if (req.params && typeof req.params === "object") {
    sanitizeObjectInPlace(req.params);
  }
  next();
}
