import { Router } from "express";

const authRouter = Router();

authRouter.get("/health", (req, res) => {
  res.success({ module: "auth" }, "Auth module healthy");
});

export default authRouter;
