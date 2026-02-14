import { Router } from "express";

const authRouter = Router();

authRouter.get("/health", (req, res) => {
  res.json({ module: "auth", status: "ok" });
});

export default authRouter;
