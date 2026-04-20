/**
 * rateLimit.js — Redis-backed rate limiter with transparent in-memory fallback.
 *
 * When REDIS_URL is set, the limiter uses Redis (shared state across instances,
 * survives restarts). Without Redis, it falls back to the original in-memory
 * Map store (suitable for single-instance development).
 *
 * Redis requires the `ioredis` package:  npm install ioredis --save
 * Set REDIS_URL=redis://localhost:6379 (or a Redis Cloud URL) in .env
 *
 * NOTE: Reads REDIS_URL directly from process.env (not app.locals.env) because
 * it's an optional field not required by validateEnv().
 */


// ─── Redis client (lazy init) ────────────────────────────────────────────────
let redisClient = null;

async function getRedisClient() {
  if (redisClient) return redisClient;
  if (!process.env.REDIS_URL) return null;

  try {
    const { default: Redis } = await import("ioredis");
    const client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy: () => null,
    });

    client.on("error", (err) => {
      // Log once, then fall back to in-memory — never crash the server
      if (err.code !== "ECONNREFUSED") {
        console.warn("[RateLimit] Redis error — falling back to in-memory:", err.message);
      }
      redisClient = null;
    });

    await client.connect().catch(() => {
      console.warn("[RateLimit] Redis unavailable — using in-memory fallback.");
    });

    if (client.status === "ready") {
      redisClient = client;
      console.info("[RateLimit] Redis rate limiter connected.");
    }
  } catch (err) {
    console.warn("[RateLimit] Error initializing Redis:", err.message);
  }

  return redisClient;
}

// ─── In-memory fallback store ────────────────────────────────────────────────
const memoryStore = new Map();

// Auto-prune memory store every 5 minutes to prevent unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of memoryStore.entries()) {
    if (now > bucket.resetAt) memoryStore.delete(key);
  }
}, 5 * 60 * 1000);

// ─── IP resolver ─────────────────────────────────────────────────────────────
function resolveClientIp(req) {
  // trust proxy is set to 1, so req.ip is already the real client IP
  return req.ip || req.socket?.remoteAddress || "unknown";
}

// ─── Redis backend ────────────────────────────────────────────────────────────
async function redisIncrement(client, key, windowMs) {
  const pipeline = client.pipeline();
  pipeline.incr(key);
  pipeline.pexpire(key, windowMs); // set TTL only if key is new
  const [[, count]] = await pipeline.exec();
  return count;
}

// ─── Limiter factory ──────────────────────────────────────────────────────────
export function createRateLimiter({
  windowMs = 15 * 60 * 1000,
  max = 120,
  message = "Too many requests, please try again later.",
  keyGenerator = resolveClientIp,
} = {}) {
  // Eagerly attempt Redis connection when this limiter is created
  getRedisClient();

  return async (req, res, next) => {
    const id  = keyGenerator(req);
    const now = Date.now();
    let overLimit = false;
    let retryAfterMs = 0;

    const redis = await getRedisClient();

    if (redis && redis.status === "ready") {
      // ── Redis path ───────────────────────────────────────────────────────
      try {
        const redisKey = `rl:${id}`;
        const count = await redisIncrement(redis, redisKey, windowMs);
        const ttl   = await redis.pttl(redisKey);
        if (count > max) {
          overLimit   = true;
          retryAfterMs = ttl > 0 ? ttl : windowMs;
        }
      } catch (err) {
        // Redis operation failed mid-request — fail open (don't block legitimate users)
        console.warn("[RateLimit] Redis op failed, passing request through:", err.message);
        return next();
      }
    } else {
      // ── In-memory fallback path ──────────────────────────────────────────
      const bucket = memoryStore.get(id);
      if (!bucket || now > bucket.resetAt) {
        memoryStore.set(id, { count: 1, resetAt: now + windowMs });
      } else {
        bucket.count += 1;
        if (bucket.count > max) {
          overLimit   = true;
          retryAfterMs = bucket.resetAt - now;
        }
      }
    }

    if (overLimit) {
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);
      res.setHeader("Retry-After", String(Math.max(1, retryAfterSec)));
      return res.fail(message, 429);
    }

    return next();
  };
}
