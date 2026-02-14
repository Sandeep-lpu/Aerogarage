import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware.js";

const adminRouter = Router();

adminRouter.get(
  "/health",
  requireAuth,
  requireRoles("admin", "staff"),
  (req, res) => {
    res.success({ module: "admin", role: req.user.role }, "Admin module healthy");
  },
);

export default adminRouter;
