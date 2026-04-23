import {
  DEFAULT_ACCESS_EXPIRES_IN,
  DEFAULT_API_RATE_LIMIT_MAX,
  DEFAULT_API_RATE_LIMIT_WINDOW_MS,
  DEFAULT_AUTH_RATE_LIMIT_MAX,
  DEFAULT_AUTH_RATE_LIMIT_WINDOW_MS,
  DEFAULT_JSON_LIMIT,
  DEFAULT_PORT,
  DEFAULT_REFRESH_EXPIRES_IN,
} from "./constants.js";

function toValidPort(value) {
  if (value === undefined || value === null || value === "") {
    return DEFAULT_PORT;
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
}

function toPositiveInt(value, fallback, label) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
}

export function validateEnv(env = process.env) {
  const errors = [];
  const nodeEnv = env.NODE_ENV || "development";
  const isProduction = nodeEnv === "production";

  if (!env.MONGO_URI || !String(env.MONGO_URI).trim()) {
    errors.push("MONGO_URI is required");
  }

  // ── PRODUCTION SAFETY: reject insecure JWT defaults ──────────────────────
  const DEV_ACCESS_SECRET = "dev_access_secret_change_in_production";
  const DEV_REFRESH_SECRET = "dev_refresh_secret_change_in_production";

  if (isProduction) {
    if (!env.JWT_ACCESS_SECRET || env.JWT_ACCESS_SECRET === DEV_ACCESS_SECRET) {
      errors.push("JWT_ACCESS_SECRET must be set to a secure value in production");
    }
    if (!env.JWT_REFRESH_SECRET || env.JWT_REFRESH_SECRET === DEV_REFRESH_SECRET) {
      errors.push("JWT_REFRESH_SECRET must be set to a secure value in production");
    }
  }

  let port = DEFAULT_PORT;
  let apiRateLimitWindowMs = DEFAULT_API_RATE_LIMIT_WINDOW_MS;
  let apiRateLimitMax = DEFAULT_API_RATE_LIMIT_MAX;
  let authRateLimitWindowMs = DEFAULT_AUTH_RATE_LIMIT_WINDOW_MS;
  let authRateLimitMax = DEFAULT_AUTH_RATE_LIMIT_MAX;

  try {
    port = toValidPort(env.PORT);
    apiRateLimitWindowMs = toPositiveInt(
      env.API_RATE_LIMIT_WINDOW_MS,
      DEFAULT_API_RATE_LIMIT_WINDOW_MS,
      "API_RATE_LIMIT_WINDOW_MS",
    );
    apiRateLimitMax = toPositiveInt(
      env.API_RATE_LIMIT_MAX,
      DEFAULT_API_RATE_LIMIT_MAX,
      "API_RATE_LIMIT_MAX",
    );
    authRateLimitWindowMs = toPositiveInt(
      env.AUTH_RATE_LIMIT_WINDOW_MS,
      DEFAULT_AUTH_RATE_LIMIT_WINDOW_MS,
      "AUTH_RATE_LIMIT_WINDOW_MS",
    );
    authRateLimitMax = toPositiveInt(
      env.AUTH_RATE_LIMIT_MAX,
      DEFAULT_AUTH_RATE_LIMIT_MAX,
      "AUTH_RATE_LIMIT_MAX",
    );
  } catch (error) {
    errors.push(error.message);
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.join("; ")}`);
  }

  return {
    MONGO_URI: String(env.MONGO_URI).trim(),
    PORT: port,
    NODE_ENV: nodeEnv,
    APP_VERSION: env.APP_VERSION || "1.0.0",
    JSON_LIMIT: env.JSON_LIMIT || DEFAULT_JSON_LIMIT,
    API_RATE_LIMIT_WINDOW_MS: apiRateLimitWindowMs,
    API_RATE_LIMIT_MAX: apiRateLimitMax,
    AUTH_RATE_LIMIT_WINDOW_MS: authRateLimitWindowMs,
    AUTH_RATE_LIMIT_MAX: authRateLimitMax,
    JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET || DEV_ACCESS_SECRET,
    JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET || DEV_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN: env.JWT_ACCESS_EXPIRES_IN || DEFAULT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: env.JWT_REFRESH_EXPIRES_IN || DEFAULT_REFRESH_EXPIRES_IN,
    // CORS — comma-separated list of allowed origins
    CORS_ORIGIN: env.CORS_ORIGIN || "http://localhost:5173",
    // Redis — optional distributed rate limiting
    REDIS_URL: env.REDIS_URL || null,
    // SMTP — optional email transport
    SMTP_HOST: env.SMTP_HOST || null,
    SMTP_PORT: env.SMTP_PORT ? Number(env.SMTP_PORT) : 587,
    SMTP_USER: env.SMTP_USER || null,
    SMTP_PASS: env.SMTP_PASS || null,
    SMTP_FROM: env.SMTP_FROM || "noreply@aerogarage.com",
    // Observability — Sentry error monitoring
    SENTRY_DSN: env.SENTRY_DSN || null,
    // API Docs — secret key required to access /api/docs in production
    DOCS_SECRET_KEY: env.DOCS_SECRET_KEY || null,
  };
}
