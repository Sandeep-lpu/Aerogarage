import { Router } from "express";
import {
  loginController,
  logoutController,
  meController,
  refreshController,
  registerController,
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
authRouter.get("/me", meController);

export default authRouter;
