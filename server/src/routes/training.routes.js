import { Router } from "express";

const trainingRouter = Router();

trainingRouter.get("/health", (req, res) => {
  res.success({ module: "training" }, "Training module healthy");
});

export default trainingRouter;
