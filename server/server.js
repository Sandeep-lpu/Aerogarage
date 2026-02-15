import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { API_PREFIX } from "./src/config/constants.js";
import { validateEnv } from "./src/config/env.js";
import apiRouter from "./src/routes/index.js";
import { requestLogger } from "./src/middleware/requestLogger.js";
import { responseFormatter } from "./src/middleware/responseFormatter.js";
import { apiNotFoundHandler } from "./src/middleware/notFound.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { securityHeaders } from "./src/middleware/securityHeaders.js";
import { sanitizeInput } from "./src/middleware/sanitizeInput.js";
import { createRateLimiter } from "./src/middleware/rateLimit.js";

dotenv.config();
const env = validateEnv();

connectDB(env.MONGO_URI);

const app = express();
app.locals.env = env;

app.use(securityHeaders);
app.use(cors());
app.use(express.json({ limit: env.JSON_LIMIT }));
app.use(sanitizeInput);
app.use(requestLogger);
app.use(responseFormatter);
app.use(
  API_PREFIX,
  createRateLimiter({
    windowMs: env.API_RATE_LIMIT_WINDOW_MS,
    max: env.API_RATE_LIMIT_MAX,
    message: "API rate limit exceeded. Please retry shortly.",
  }),
);

app.get("/", (req, res) => {
  res.success({ service: "aerogarage-api" }, "Server running");
});

app.use(API_PREFIX, apiRouter);
app.use(API_PREFIX, apiNotFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => console.log(`Server running on ${env.PORT}`));
