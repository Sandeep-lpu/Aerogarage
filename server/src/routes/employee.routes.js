import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware.js";
import {
  createEmployeeRequestController,
  getEmployeeDashboardController,
  getEmployeeProfileController,
  listEmployeeDocumentsController,
  listEmployeeRequestsController,
  getEmployeeAssignedRequestsController,
  getEmployeeTrainingEnrollmentsController,
  listEmployeeTasksController,
  submitEmployeeRequestController,
  updateEmployeeProfileController,
  updateEmployeeTaskController,
} from "../modules/employee/controllers/employee.controller.js";
import {
  createEmployeeRequestValidator,
  submitEmployeeRequestValidator,
  updateEmployeeProfileValidator,
  updateEmployeeTaskValidator,
  validateRequest,
} from "../modules/employee/validators/employee.validators.js";

const employeeRouter = Router();

employeeRouter.use(requireAuth, requireRoles("employee", "staff", "admin"));

employeeRouter.get("/health", (req, res) => {
  res.success({ module: "employee", role: req.user.role }, "Employee module healthy");
});

employeeRouter.get("/dashboard", getEmployeeDashboardController);

employeeRouter.get("/profile", getEmployeeProfileController);
employeeRouter.patch("/profile", updateEmployeeProfileValidator, validateRequest, updateEmployeeProfileController);

employeeRouter.get("/documents", listEmployeeDocumentsController);

employeeRouter.get("/requests", listEmployeeRequestsController);
employeeRouter.get("/assigned-requests", getEmployeeAssignedRequestsController);
employeeRouter.post("/requests", createEmployeeRequestValidator, validateRequest, createEmployeeRequestController);
employeeRouter.patch(
  "/requests/:workItemId/submit",
  submitEmployeeRequestValidator,
  validateRequest,
  submitEmployeeRequestController,
);

employeeRouter.get("/training-enrollments", getEmployeeTrainingEnrollmentsController);

employeeRouter.get("/tasks", listEmployeeTasksController);
employeeRouter.patch("/tasks/:workItemId", updateEmployeeTaskValidator, validateRequest, updateEmployeeTaskController);

export default employeeRouter;
