import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware.js";
import { getAnalyticsDashboard } from "../modules/admin/controllers/analytics.controller.js";

const analyticsRouter = Router();

analyticsRouter.use(requireAuth, requireRoles("admin", "staff")); // Protect via RBAC

analyticsRouter.get("/dashboard", getAnalyticsDashboard);

export default analyticsRouter;
