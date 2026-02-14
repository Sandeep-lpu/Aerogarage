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

const authRouter = Router();

authRouter.get("/health", (req, res) => {
  res.success({ module: "auth" }, "Auth module healthy");
});

authRouter.post("/register", registerValidator, validateRequest, registerController);
authRouter.post("/login", loginValidator, validateRequest, loginController);
authRouter.post("/refresh", refreshValidator, validateRequest, refreshController);
authRouter.post("/logout", logoutValidator, validateRequest, logoutController);
authRouter.get("/me", meController);

export default authRouter;
