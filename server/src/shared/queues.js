import { Queue } from "bullmq";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// ── Redis connection with graceful fallback ───────────────────────────────────
// If Redis is not running in local dev the queue is disabled and emails are
// sent synchronously as a fallback so the server still starts cleanly.
let redisConnection = null;
let emailQueue = null;

function tryConnectRedis() {
  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 3000,
      lazyConnect: false,
      retryStrategy: () => null,
    });

    client.on("error", () => {
      // Silently handle connection errors — we'll degrade gracefully
    });

    client.on("ready", () => {
      emailQueue = new Queue("emailQueue", { connection: client });
      console.log("🟢 BullMQ email queue connected to Redis");
    });

    client.on("close", () => {
      emailQueue = null;
    });

    redisConnection = client;
  } catch {
    console.warn(
      "⚠️  BullMQ: Redis not available — email queue disabled.\n" +
      "   Emails will be sent directly (dev fallback). Set REDIS_URL in .env to enable queuing.",
    );
  }
}

tryConnectRedis();

/**
 * addEmailToQueue — Enqueues an email via BullMQ if Redis is up, or sends it
 * directly as a dev fallback when Redis is unavailable.
 */
export async function addEmailToQueue(emailData) {
  if (emailQueue) {
    try {
      await emailQueue.add("sendEmail", emailData, {
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
      });
      return;
    } catch (error) {
      console.warn("[Queues] Failed to enqueue email, falling back to direct send:", error.message);
    }
  }
  // Fallback: send synchronously (local dev without Redis)
  const { actuallySendMail } = await import("../services/mailer.js");
  await actuallySendMail(emailData);
}

export { emailQueue };
