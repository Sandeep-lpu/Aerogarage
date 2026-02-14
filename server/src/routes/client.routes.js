import { Router } from "express";

const clientRouter = Router();

clientRouter.get("/health", (req, res) => {
  res.json({ module: "client", status: "ok" });
});

export default clientRouter;
