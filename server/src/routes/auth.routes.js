import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  loginController,
  logoutController,
  meController,
  refreshController,
  registerController,
  verifyEmailController,
  resendVerificationController,
} from "../modules/auth/controllers/auth.controller.js";
import {
  loginValidator,
  logoutValidator,
  refreshValidator,
  registerValidator,
  validateRequest,
} from "../modules/auth/validators/auth.validators.js";
import { createRateLimiter } from "../middleware/rateLimit.js";

const authRouter = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       409:
 *         description: Email already in use
 *       429:
 *         description: Too many registration attempts
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and receive JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful — returns accessToken + refreshToken
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token issued
 *       401:
 *         description: Refresh token invalid or expired
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Invalidate the current refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authenticated
 */

const loginRateLimiter = createRateLimiter({
  keyGenerator: (req) => `${req.ip || "unknown"}:login`,
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: "Too many login attempts. Please wait and try again.",
});

const registerRateLimiter = createRateLimiter({
  keyGenerator: (req) => `${req.ip || "unknown"}:register`,
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: "Too many registration attempts. Please wait and try again.",
});

authRouter.get("/health", (req, res) => {
  res.success({ module: "auth" }, "Auth module healthy");
});

authRouter.post("/register", registerRateLimiter, registerValidator, validateRequest, registerController);
authRouter.post("/login", loginRateLimiter, loginValidator, validateRequest, loginController);
authRouter.post("/refresh", refreshValidator, validateRequest, refreshController);
authRouter.post("/logout", logoutValidator, validateRequest, logoutController);
authRouter.get("/me", requireAuth, meController);
// Email verification — public link from email
authRouter.get("/verify-email", verifyEmailController);
// Resend verification — requires the user to be logged in
authRouter.post("/resend-verification", requireAuth, resendVerificationController);

export default authRouter;
