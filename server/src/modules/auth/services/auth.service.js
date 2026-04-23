import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createRefreshToken,
  createUser,
  findRefreshTokenByHash,
  findUserByEmail,
  findUserById,
  revokeAllRefreshTokensForUser,
  revokeRefreshTokenByHash,
} from "../repositories/auth.repository.js";
import EmailVerificationToken, {
  generateRawToken,
  hashToken,
} from "../../../shared/models/emailVerificationToken.model.js";
import { sendVerificationEmail } from "../../../services/mailer.js";

function signAccessToken(user, env) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, email: user.email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
  );
}

function signRefreshToken(user, env) {
  return jwt.sign(
    { sub: String(user._id), type: "refresh" },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN },
  );
}

function toAuthUser(user) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser(payload) {
  const existing = await findUserByEmail(payload.email);
  if (existing) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await createUser({
    fullName: payload.fullName,
    email: payload.email,
    role: payload.role || "client",
    passwordHash,
  });

  // Send email verification — fire-and-forget so SMTP issues never fail registration
  try {
    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h
    await EmailVerificationToken.create({ userId: user._id, tokenHash, expiresAt });
    sendVerificationEmail(user.email, rawToken).catch((err) =>
      console.error("[Auth] Failed to send verification email:", err.message),
    );
  } catch (err) {
    console.error("[Auth] Could not create verification token:", err.message);
  }

  return toAuthUser(user);
}

export async function loginUser(payload, env) {
  const user = await findUserByEmail(payload.email);

  if (!user || !user.isActive) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isValidPassword) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken(user, env);
  const refreshToken = signRefreshToken(user, env);
  const decodedRefresh = jwt.decode(refreshToken);
  await createRefreshToken({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(decodedRefresh.exp * 1000),
  });

  return {
    accessToken,
    refreshToken,
    user: toAuthUser(user),
  };
}

export async function refreshAuthToken(refreshToken, env) {
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  const tokenHash = hashToken(refreshToken);
  const storedToken = await findRefreshTokenByHash(tokenHash);

  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
    const error = new Error("Refresh token expired or revoked");
    error.statusCode = 401;
    throw error;
  }

  const user = await findUserById(decoded.sub);
  if (!user || !user.isActive) {
    const error = new Error("User not active");
    error.statusCode = 401;
    throw error;
  }

  await revokeRefreshTokenByHash(tokenHash);

  const nextAccessToken = signAccessToken(user, env);
  const nextRefreshToken = signRefreshToken(user, env);
  const decodedNextRefresh = jwt.decode(nextRefreshToken);

  await createRefreshToken({
    userId: user._id,
    tokenHash: hashToken(nextRefreshToken),
    expiresAt: new Date(decodedNextRefresh.exp * 1000),
  });

  return {
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
    user: toAuthUser(user),
  };
}

export async function logoutUser(refreshToken) {
  if (!refreshToken) return;
  const tokenHash = hashToken(refreshToken);
  await revokeRefreshTokenByHash(tokenHash);
}

export async function revokeUserSessions(userId) {
  await revokeAllRefreshTokensForUser(userId);
}

export function verifyAccessToken(token, env) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

/**
 * verifyEmailToken — validates the raw token from the email link,
 * marks the user's emailVerified = true, and deletes the token.
 */
export async function verifyEmailToken(rawToken) {
  if (!rawToken) {
    const err = new Error("Verification token is required");
    err.statusCode = 400;
    throw err;
  }

  const tokenHash = hashToken(rawToken);
  const record = await EmailVerificationToken.findOne({ tokenHash });

  if (!record || record.expiresAt < new Date()) {
    // Delete expired/used record if it exists
    if (record) await record.deleteOne();
    const err = new Error("Verification link is invalid or has expired");
    err.statusCode = 400;
    throw err;
  }

  // Mark user as verified and delete the token atomically
  await Promise.all([
    findUserById(record.userId).then((user) => {
      if (user) {
        user.emailVerified = true;
        return user.save();
      }
    }),
    record.deleteOne(),
  ]);

  return { message: "Email verified successfully" };
}

/**
 * resendVerificationEmail — lets users request a new verification link
 * if the first email was missed or expired.
 */
export async function resendVerificationEmail(userId) {
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  if (user.emailVerified) {
    const err = new Error("Email is already verified");
    err.statusCode = 409;
    throw err;
  }

  // Revoke any existing tokens for this user, then create a fresh one
  await EmailVerificationToken.deleteMany({ userId });

  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await EmailVerificationToken.create({ userId, tokenHash, expiresAt });
  await sendVerificationEmail(user.email, rawToken);
}

