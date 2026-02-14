import { Router } from "express";

const trainingRouter = Router();

trainingRouter.get("/health", (req, res) => {
  res.json({ module: "training", status: "ok" });
});

export default trainingRouter;
