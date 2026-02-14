import {
  DEFAULT_ACCESS_EXPIRES_IN,
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

export function validateEnv(env = process.env) {
  const errors = [];

  if (!env.MONGO_URI || !String(env.MONGO_URI).trim()) {
    errors.push("MONGO_URI is required");
  }

  let port = DEFAULT_PORT;
  try {
    port = toValidPort(env.PORT);
  } catch (error) {
    errors.push(error.message);
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.join("; ")}`);
  }

  return {
    MONGO_URI: String(env.MONGO_URI).trim(),
    PORT: port,
    NODE_ENV: env.NODE_ENV || "development",
    JWT_ACCESS_SECRET:
      env.JWT_ACCESS_SECRET || "dev_access_secret_change_in_production",
    JWT_REFRESH_SECRET:
      env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_in_production",
    JWT_ACCESS_EXPIRES_IN:
      env.JWT_ACCESS_EXPIRES_IN || DEFAULT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN:
      env.JWT_REFRESH_EXPIRES_IN || DEFAULT_REFRESH_EXPIRES_IN,
  };
}
