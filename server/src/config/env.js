import { DEFAULT_PORT } from "./constants.js";

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
  };
}
