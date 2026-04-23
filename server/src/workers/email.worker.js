/**
 * email.worker.js — BullMQ worker for processing the email queue.
 *
 * This worker is optional: if Redis is not available (e.g. local dev without
 * Docker) the worker silently skips initialisation so the server still starts.
 */
import { actuallySendMail } from "../services/mailer.js";

async function startWorker() {
  // Uses REDIS_URL from env or defaults to local Redis instance
  const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

  try {
    const { Worker } = await import("bullmq");
    const { default: Redis } = await import("ioredis");

    const redisConnection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      connectTimeout: 3000,
    });

    // Prevent worker from crashing the app if Redis connection drops
    redisConnection.on("error", () => {});

    // Test connection before creating the BullMQ worker
    await redisConnection.ping();

    const emailWorker = new Worker(
      "emailQueue",
      async (job) => {
        if (job.name === "sendEmail") {
          await actuallySendMail(job.data);
        }
      },
      { connection: redisConnection },
    );

    emailWorker.on("completed", (job) => {
      console.log(`[EmailWorker] Job ${job.id} completed`);
    });

    emailWorker.on("failed", (job, err) => {
      console.error(`[EmailWorker] Job ${job?.id} failed: ${err.message}`);
    });

    console.log("🟢 Email worker started and listening on Redis queue");
  } catch (err) {
    console.warn(
      "⚠️  Email worker: Redis not available — worker disabled. Reason:", err.message,
      "\n   Emails will be sent synchronously via the queue fallback in queues.js.",
    );
  }
}

// Start without awaiting so it doesn't block server boot
startWorker();
