import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import connectDB from "./src/config/db.js";
import { API_PREFIX } from "./src/config/constants.js";
import { validateEnv } from "./src/config/env.js";
import { swaggerSpec, swaggerUiOptions } from "./src/config/swagger.js";
import { initSentry, sentryErrorHandler } from "./src/config/sentry.js";
import { createHealthRouter } from "./src/routes/health.routes.js";
import apiRouter from "./src/routes/index.js";
import { requestLogger } from "./src/middleware/requestLogger.js";
import { responseFormatter } from "./src/middleware/responseFormatter.js";
import { apiNotFoundHandler } from "./src/middleware/notFound.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { securityHeaders } from "./src/middleware/securityHeaders.js";
import { sanitizeInput } from "./src/middleware/sanitizeInput.js";
import { createRateLimiter } from "./src/middleware/rateLimit.js";
import { initSocketServer } from "./src/shared/socketContext.js";
import "./src/workers/email.worker.js"; // Initialize email worker

dotenv.config();
const env = validateEnv();

// ─── Database ────────────────────────────────────────────────────────────────
connectDB(env.MONGO_URI);

// ─── App ─────────────────────────────────────────────────────────────────────
const app = express();
app.set("trust proxy", 1);
app.locals.env = env;

// ─── Sentry — must be FIRST (before any other middleware) ────────────────────
await initSentry(app, env);

// ─── Security ────────────────────────────────────────────────────────────────
app.use(securityHeaders);

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ─── Body + Input ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: env.JSON_LIMIT }));
app.use(sanitizeInput);

// ─── Logging + Response helpers ───────────────────────────────────────────────
app.use(requestLogger);
app.use(responseFormatter);

// ─── Rate Limiting ───────────────────────────────────────────────────────────
app.use(
  API_PREFIX,
  createRateLimiter({
    windowMs: env.API_RATE_LIMIT_WINDOW_MS,
    max: env.API_RATE_LIMIT_MAX,
    message: "API rate limit exceeded. Please retry shortly.",
  }),
);

// ─── Root liveness probe ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.success({ service: "aerogarage-api", version: "1.0.0" }, "Server running");
});

// ─── OpenAPI / Swagger UI ────────────────────────────────────────────────────
// Available at /api/docs — restricted to admin + development
app.use(
  `${API_PREFIX}/docs`,
  (req, res, next) => {
    // In production, only serve docs to requests with a secret key or from internal networks
    if (env.NODE_ENV === "production") {
      const docsKey = req.headers["x-docs-key"] || req.query.key;
      if (!docsKey || docsKey !== env.DOCS_SECRET_KEY) {
        return res.status(404).json({ success: false, message: "Not Found" });
      }
    }
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions),
);

// Raw OpenAPI JSON spec — for Postman imports
app.get(`${API_PREFIX}/docs.json`, (req, res) => {
  if (env.NODE_ENV === "production") {
    const docsKey = req.headers["x-docs-key"] || req.query.key;
    if (!docsKey || docsKey !== env.DOCS_SECRET_KEY) {
      return res.status(404).json({ success: false, message: "Not Found" });
    }
  }
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec);
});

// ─── Enhanced Health Check ───────────────────────────────────────────────────
app.use(`${API_PREFIX}/health`, createHealthRouter(env));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use(API_PREFIX, apiRouter);
app.use(API_PREFIX, apiNotFoundHandler);

// ─── Sentry Error Handler (before our own errorHandler) ──────────────────────
app.use(sentryErrorHandler());

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Socket.io & Server Start ────────────────────────────────────────────────
const server = http.createServer(app);
await initSocketServer(server);

server.listen(env.PORT, () => {
  console.log(`✈  Aerogarage API running on port ${env.PORT} [${env.NODE_ENV}]`);
  if (env.NODE_ENV !== "production") {
    console.log(`📖  Swagger UI → http://localhost:${env.PORT}${API_PREFIX}/docs`);
  }
});
