/**
 * mailer.js — Nodemailer transport wrapper.
 *
 * Requires nodemailer:  npm install nodemailer --save
 * Configure SMTP via environment variables (see .env.example):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *
 * When SMTP_HOST is not set (e.g. in local dev), sendMail() is a no-op and
 * the verification link is printed to the server console instead.
 *
 * NOTE: Reads directly from process.env (not from app.locals.env) because
 * these are optional fields not required by validateEnv().
 */
import { addEmailToQueue } from "../shared/queues.js";

let _transporter = null;

async function getTransporter() {
  if (_transporter) return _transporter;
  if (!process.env.SMTP_HOST) return null; // graceful degradation — no SMTP configured

  try {
    const { default: nodemailer } = await import("nodemailer");
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    _transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return _transporter;
  } catch {
    console.warn("[Mailer] nodemailer not installed — run: npm install nodemailer");
    return null;
  }
}

/**
 * actuallySendMail — handles the real SMTP sending.
 * Should only be called by the BullMQ worker.
 */
export async function actuallySendMail({ to, subject, html, text }) {
  const transporter = await getTransporter();

  if (!transporter) {
    // Dev fallback — log so developers can test the flow without real SMTP
    console.info(`[Mailer] SMTP not configured. Would have sent:\nTo: ${to}\nSubject: ${subject}\n${text || "(html only)"}`);
    return;
  }

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || "noreply@aerogarage.com",
    to,
    subject,
    html,
    text,
  });
}

/**
 * sendMail — Public wrapper to enqueue an email instead of blocking the thread.
 */
export async function sendMail(emailData) {
  if (process.env.NODE_ENV === "test") {
    // Synchronous execution for tests if needed, or mock it
    await actuallySendMail(emailData);
    return;
  }
  await addEmailToQueue(emailData);
}

/**
 * sendVerificationEmail — sends the email verification link to a new user.
 * @param {string} toEmail
 * @param {string} rawToken — the raw (unhashed) token to embed in the URL
 * @param {string} [baseUrl] — defaults to CORS_ORIGIN (the frontend URL)
 */
export async function sendVerificationEmail(toEmail, rawToken, baseUrl) {
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
  const frontendUrl = baseUrl || corsOrigin.split(",")[0].trim();
  const verifyUrl = `${frontendUrl}/verify-email?token=${rawToken}`;

  await sendMail({
    to:      toEmail,
    subject: "Verify your Aerogarage account email",
    text:    `Please verify your email by visiting: ${verifyUrl}\n\nThis link expires in 24 hours.`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#1e3a5f">Verify your email address</h2>
        <p>Thank you for registering with <strong>Aerogarage</strong>.</p>
        <p>Click the button below to verify your email address. This link expires in <strong>24 hours</strong>.</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 28px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Verify Email
        </a>
        <p style="margin-top:24px;color:#64748b;font-size:0.85rem">
          If you did not create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
