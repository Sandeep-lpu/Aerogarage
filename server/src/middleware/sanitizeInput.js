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
    if (key.startsWith("$") || key.includes(".")) continue;
    next[key] = sanitizeValue(child);
  }
  return next;
}

function sanitizeObjectInPlace(target) {
  if (!target || typeof target !== "object") return;
  const clean = sanitizeValue(target);
  for (const key of Object.keys(target)) {
    delete target[key];
  }
  Object.assign(target, clean);
}

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
