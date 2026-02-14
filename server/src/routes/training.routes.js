import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware.js";

const trainingRouter = Router();

trainingRouter.get(
  "/health",
  requireAuth,
  requireRoles("student", "staff", "admin"),
  (req, res) => {
    res.success({ module: "training", role: req.user.role }, "Training module healthy");
  },
);

export default trainingRouter;
