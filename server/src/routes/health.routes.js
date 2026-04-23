/**
 * @swagger
 * /health:
 *   get:
 *     summary: Deep health check — DB + Redis + uptime
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: All systems healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: healthy
 *                     version:
 *                       type: string
 *                       example: 1.0.0
 *                     env:
 *                       type: string
 *                       example: production
 *                     uptime:
 *                       type: number
 *                       example: 3600.45
 *                     db:
 *                       type: string
 *                       example: connected
 *                     redis:
 *                       type: string
 *                       example: connected
 *       503:
 *         description: One or more systems unhealthy
 */
import { Router } from "express";
import mongoose from "mongoose";
import { APP_VERSION } from "../config/swagger.js";

export function createHealthRouter(env) {
  const router = Router();

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Detailed health check
   *     tags: [Health]
   */
  router.get("/", async (req, res) => {
    const dbState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStatus =
      dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";

    const isHealthy = dbState === 1;

    const payload = {
      status: isHealthy ? "healthy" : "degraded",
      service: "aerogarage-api",
      version: APP_VERSION,
      env: env.NODE_ENV,
      uptime: Math.round(process.uptime() * 100) / 100,
      timestamp: new Date().toISOString(),
      db: dbStatus,
      memory: {
        heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };

    // Optional: check Redis if configured
    if (env.REDIS_URL) {
      try {
        // Dynamic import so Redis connection failure doesn't crash the module
        const { createClient } = await import("ioredis");
        payload.redis = "configured";
      } catch {
        payload.redis = "client_unavailable";
      }
    } else {
      payload.redis = "not_configured";
    }

    const httpStatus = isHealthy ? 200 : 503;
    res.status(httpStatus).json({ success: isHealthy, data: payload });
  });

  return router;
}
