const stores = new Map();

function resolveClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

export function createRateLimiter({
  windowMs = 15 * 60 * 1000,
  max = 120,
  message = "Too many requests, please try again later.",
  keyGenerator = resolveClientIp,
} = {}) {
  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const bucket = stores.get(key);

    if (!bucket || now > bucket.resetAt) {
      stores.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    bucket.count += 1;
    if (bucket.count > max) {
      const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(Math.max(1, retryAfterSec)));
      return res.fail(message, 429);
    }

    return next();
  };
}
