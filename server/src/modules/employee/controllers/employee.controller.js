import {
  createWorkItem,
  getEmployeeDashboard,
  getEmployeeDocuments,
  getEmployeeProfile,
  getEmployeeRequests,
  getEmployeeTasks,
  saveEmployeeProfile,
  submitEmployeeRequest,
  updateEmployeeTask,
  getEmployeeAssignedRequests,
  getEmployeeTrainingEnrollments,
} from "../services/employee.service.js";
import { emitToRole } from "../../../shared/socketContext.js";

export async function getEmployeeDashboardController(req, res, next) {
  try {
    const dashboard = await getEmployeeDashboard(req.user.id, req.user);
    return res.success({ dashboard }, "Employee dashboard fetched");
  } catch (error) {
    return next(error);
  }
}

export async function createEmployeeRequestController(req, res, next) {
  try {
    const workItem = await createWorkItem(req.user, {
      title: req.body.title,
      type: req.body.type,
      priority: req.body.priority || "medium",
      description: req.body.description,
      approvalRequired: req.body.approvalRequired !== false,
      dueDate: req.body.dueDate || null,
    });

    return res.success(
      {
        id: workItem._id,
        status: workItem.status,
        createdAt: workItem.createdAt,
      },
      "Employee request draft created",
      201,
    );
  } catch (error) {
    return next(error);
  }
}

export async function listEmployeeRequestsController(req, res, next) {
  try {
    const requests = await getEmployeeRequests(req.user.id);
    return res.success({ requests }, "Employee requests fetched");
  } catch (error) {
    return next(error);
  }
}

export async function getEmployeeAssignedRequestsController(req, res, next) {
  try {
    const requests = await getEmployeeAssignedRequests(req.user.id);
    return res.success({ requests }, "Employee assigned requests fetched");
  } catch (error) {
    return next(error);
  }
}

export async function getEmployeeTrainingEnrollmentsController(req, res, next) {
  try {
    const enrollments = await getEmployeeTrainingEnrollments(req.user.id);
    return res.success({ enrollments }, "Employee training enrollments fetched");
  } catch (error) {
    return next(error);
  }
}

export async function submitEmployeeRequestController(req, res, next) {
  try {
    const request = await submitEmployeeRequest(req.user.id, req.params.workItemId);
    emitToRole("data_updated", "admin", { action: "request_submitted" });
    return res.success({ request }, "Employee request submitted for approval");
  } catch (error) {
    return next(error);
  }
}

export async function listEmployeeTasksController(req, res, next) {
  try {
    const tasks = await getEmployeeTasks(req.user.id);
    return res.success({ tasks }, "Employee tasks fetched");
  } catch (error) {
    return next(error);
  }
}

export async function updateEmployeeTaskController(req, res, next) {
  try {
    const task = await updateEmployeeTask(req.user.id, req.params.workItemId, {
      status: req.body.status,
      description: req.body.description,
      priority: req.body.priority,
      note: req.body.note,
    });
    emitToRole("data_updated", "admin", { action: "task_updated" });
    return res.success({ task }, "Employee task updated");
  } catch (error) {
    return next(error);
  }
}

export function listEmployeeDocumentsController(req, res) {
  const documents = getEmployeeDocuments(req.user);
  return res.success({ documents }, "Employee documents fetched");
}

export async function getEmployeeProfileController(req, res, next) {
  try {
    const profile = await getEmployeeProfile(req.user.id);
    return res.success({ profile }, "Employee profile fetched");
  } catch (error) {
    return next(error);
  }
}

export async function updateEmployeeProfileController(req, res, next) {
  try {
    const updates = {};
    if (typeof req.body.fullName === "string") updates.fullName = req.body.fullName;
    if (typeof req.body.department === "string") updates.department = req.body.department;
    if (typeof req.body.designation === "string") updates.designation = req.body.designation;
    if (typeof req.body.shift === "string") updates.shift = req.body.shift;

    const profile = await saveEmployeeProfile(req.user.id, updates);
    return res.success({ profile }, "Employee profile updated");
  } catch (error) {
    return next(error);
  }
}
