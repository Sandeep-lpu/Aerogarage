import mongoose from "mongoose";
import crypto from "crypto";

/**
 * EmailVerificationToken — short-lived token used to verify a user's email address.
 *
 * Flow:
 *   1. On registration, createVerificationToken(userId) produces a signed token.
 *   2. The token is emailed to the user (via mailer.js).
 *   3. User clicks the link → GET /auth/verify-email?token=<token>
 *   4. verifyEmailToken(token) validates, marks User.emailVerified = true, deletes token.
 *   5. MongoDB TTL auto-deletes unverified tokens after 24 h.
 */
const emailVerificationTokenSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    // TTL index: Mongoose auto-deletes documents 24 h after creation
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true },
);

export default mongoose.model("EmailVerificationToken", emailVerificationTokenSchema);

// ─── Static token helpers (live on the model file for colocation) ─────────────

/** Generates a random 48-byte hex token for the email link */
export function generateRawToken() {
  return crypto.randomBytes(48).toString("hex");
}

/** SHA-256 hash of the raw token (only the hash is stored in DB) */
export function hashToken(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}
