import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware.js";
import {
  approveAdminWorkItemController,
  getAdminPublicContentController,
  listAdminApprovalsController,
  listAdminServiceRequestsController,
  listAdminTrainingModulesController,
  listAdminUsersController,
  rejectAdminWorkItemController,
  updateAdminServiceContentController,
  updateAdminServiceRequestStatusController,
  assignAdminServiceRequestController,
  updateAdminTrainingContentController,
  updateAdminTrainingModuleController,
  enrollAdminEmployeeTrainingController,
  updateAdminUserRoleController,
  updateAdminUserStatusController,
  getAdminAuditLogsController,
} from "../modules/admin/controllers/admin.controller.js";
import {
  approvalDecisionValidator,
  listAdminUsersValidator,
  listAdminRequestsValidator,
  updateAdminServiceContentValidator,
  updateAdminServiceRequestStatusValidator,
  updateAdminTrainingContentValidator,
  updateAdminTrainingModuleValidator,
  enrollAdminEmployeeTrainingValidator,
  updateAdminUserRoleValidator,
  updateAdminUserStatusValidator,
  assignAdminServiceRequestValidator,
  validateRequest,
} from "../modules/admin/validators/admin.validators.js";

const adminRouter = Router();

adminRouter.use(requireAuth, requireRoles("admin", "staff"));

adminRouter.get("/health", (req, res) => {
  res.success({ module: "admin", role: req.user.role }, "Admin module healthy");
});

adminRouter.get("/users", listAdminUsersValidator, validateRequest, listAdminUsersController);
adminRouter.patch("/users/:userId/role", updateAdminUserRoleValidator, validateRequest, updateAdminUserRoleController);
adminRouter.patch("/users/:userId/status", updateAdminUserStatusValidator, validateRequest, updateAdminUserStatusController);

adminRouter.get("/requests", listAdminRequestsValidator, validateRequest, listAdminServiceRequestsController);
adminRouter.patch(
  "/requests/:requestId/status",
  updateAdminServiceRequestStatusValidator,
  validateRequest,
  updateAdminServiceRequestStatusController,
);
adminRouter.patch(
  "/requests/:requestId/assign",
  assignAdminServiceRequestValidator,
  validateRequest,
  assignAdminServiceRequestController,
);

adminRouter.get("/training/modules", listAdminTrainingModulesController);
adminRouter.patch(
  "/training/modules/:moduleId",
  updateAdminTrainingModuleValidator,
  validateRequest,
  updateAdminTrainingModuleController,
);
adminRouter.post(
  "/training/enroll",
  enrollAdminEmployeeTrainingValidator,
  validateRequest,
  enrollAdminEmployeeTrainingController,
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

adminRouter.get("/approvals", listAdminApprovalsController);
adminRouter.patch(
  "/approvals/:workItemId/approve",
  approvalDecisionValidator,
  validateRequest,
  approveAdminWorkItemController,
);
adminRouter.patch(
  "/approvals/:workItemId/reject",
  approvalDecisionValidator,
  validateRequest,
  rejectAdminWorkItemController,
);

adminRouter.get("/audit-logs", getAdminAuditLogsController);

export default adminRouter;
