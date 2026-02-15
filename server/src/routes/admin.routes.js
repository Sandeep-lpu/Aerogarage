import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware.js";
import {
  getAdminPublicContentController,
  listAdminServiceRequestsController,
  listAdminTrainingModulesController,
  listAdminUsersController,
  updateAdminServiceContentController,
  updateAdminServiceRequestStatusController,
  updateAdminTrainingContentController,
  updateAdminTrainingModuleController,
  updateAdminUserRoleController,
  updateAdminUserStatusController,
} from "../modules/admin/controllers/admin.controller.js";
import {
  updateAdminServiceContentValidator,
  updateAdminServiceRequestStatusValidator,
  updateAdminTrainingContentValidator,
  updateAdminTrainingModuleValidator,
  updateAdminUserRoleValidator,
  updateAdminUserStatusValidator,
  validateRequest,
} from "../modules/admin/validators/admin.validators.js";

const adminRouter = Router();

adminRouter.use(requireAuth, requireRoles("admin", "staff"));

adminRouter.get("/health", (req, res) => {
  res.success({ module: "admin", role: req.user.role }, "Admin module healthy");
});

adminRouter.get("/users", listAdminUsersController);
adminRouter.patch("/users/:userId/role", updateAdminUserRoleValidator, validateRequest, updateAdminUserRoleController);
adminRouter.patch("/users/:userId/status", updateAdminUserStatusValidator, validateRequest, updateAdminUserStatusController);

adminRouter.get("/requests", listAdminServiceRequestsController);
adminRouter.patch(
  "/requests/:requestId/status",
  updateAdminServiceRequestStatusValidator,
  validateRequest,
  updateAdminServiceRequestStatusController,
);

adminRouter.get("/training/modules", listAdminTrainingModulesController);
adminRouter.patch(
  "/training/modules/:moduleId",
  updateAdminTrainingModuleValidator,
  validateRequest,
  updateAdminTrainingModuleController,
);

adminRouter.get("/content/public", getAdminPublicContentController);
adminRouter.patch(
  "/content/public/services/:slug",
  updateAdminServiceContentValidator,
  validateRequest,
  updateAdminServiceContentController,
);
adminRouter.patch(
  "/content/public/training",
  updateAdminTrainingContentValidator,
  validateRequest,
  updateAdminTrainingContentController,
);

export default adminRouter;
