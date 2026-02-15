import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware.js";
import {
  downloadTrainingResourceController,
  getTrainingDashboardController,
  getTrainingExamsController,
  getTrainingModulesController,
  getTrainingResourcesController,
} from "../modules/training/controllers/training.controller.js";

const trainingRouter = Router();

trainingRouter.use(requireAuth, requireRoles("student", "staff", "admin"));

trainingRouter.get("/health", (req, res) => {
  res.success({ module: "training", role: req.user.role }, "Training module healthy");
});

trainingRouter.get("/dashboard", getTrainingDashboardController);
trainingRouter.get("/modules", getTrainingModulesController);
trainingRouter.get("/exams", getTrainingExamsController);
trainingRouter.get("/resources", getTrainingResourcesController);
trainingRouter.get("/resources/:resourceId/download", downloadTrainingResourceController);

export default trainingRouter;
