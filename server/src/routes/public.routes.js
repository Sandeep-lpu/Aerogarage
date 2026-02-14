import { Router } from "express";

const publicRouter = Router();

publicRouter.get("/health", (req, res) => {
  res.json({ module: "public", status: "ok" });
});

export default publicRouter;
