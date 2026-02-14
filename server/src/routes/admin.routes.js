import { Router } from "express";

const adminRouter = Router();

adminRouter.get("/health", (req, res) => {
  res.json({ module: "admin", status: "ok" });
});

export default adminRouter;
