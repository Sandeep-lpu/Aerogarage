import {
  changeUserRole,
  changeUserStatus,
  approveAdminWorkItem,
  rejectAdminWorkItem,
  getAdminPublicContent,
  getAdminApprovalQueue,
  getAdminServiceRequests,
  getAdminTrainingModules,
  getAdminUsers,
  patchAdminServiceContent,
  patchAdminTrainingContent,
  patchAdminTrainingModule,
  updateAdminServiceRequestStatus,
  assignAdminServiceRequest,
  enrollAdminEmployeeTraining,
} from "../services/admin.service.js";
import { createAuditLog, getAllAuditLogs } from "../services/auditLog.service.js";
import { emitToRole, emitToUserAndAdmins } from "../../../shared/socketContext.js";

// ─── Users ────────────────────────────────────────────────────────────────────

export async function listAdminUsersController(req, res, next) {
  try {
    const { page, limit, search, role, isActive } = req.query;
    const result = await getAdminUsers({
      search,
      role,
      isActive: isActive === undefined ? undefined : isActive === "true",
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 25,
    });
    return res.success(result, "Users fetched");
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminUserRoleController(req, res, next) {
  try {
    const user = await changeUserRole(req.params.userId, req.body.role);
    await createAuditLog(req.user, "USER_ROLE_CHANGED", {
      targetId:   user._id,
      targetType: "User",
      metadata:   { newRole: req.body.role, userEmail: user.email },
    });
    return res.success({ user }, "User role updated");
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminUserStatusController(req, res, next) {
  try {
    const user = await changeUserStatus(req.params.userId, req.body.isActive);
    await createAuditLog(req.user, "USER_STATUS_CHANGED", {
      targetId:   user._id,
      targetType: "User",
      metadata:   { isActive: req.body.isActive, userEmail: user.email },
    });
    return res.success({ user }, "User status updated");
  } catch (error) {
    return next(error);
  }
}

// ─── Service Requests ─────────────────────────────────────────────────────────

export async function listAdminServiceRequestsController(req, res, next) {
  try {
    const { page, limit, status, priority } = req.query;
    const result = await getAdminServiceRequests({
      status,
      priority,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 25,
    });
    return res.success(result, "Service requests fetched");
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminServiceRequestStatusController(req, res, next) {
  try {
    const request = await updateAdminServiceRequestStatus(req.params.requestId, req.body.status, req.user._id);
    await createAuditLog(req.user, "SERVICE_REQUEST_STATUS_CHANGED", {
      targetId:   request._id,
      targetType: "ClientRequest",
      metadata:   { newStatus: req.body.status },
    });
    emitToUserAndAdmins("data_updated", request.userId, { action: "request_updated" });
    if (request.assignedEmployeeId) {
      emitToUserAndAdmins("data_updated", request.assignedEmployeeId, { action: "request_updated" });
    }
    return res.success({ request }, "Service request updated");
  } catch (error) {
    return next(error);
  }
}

export async function assignAdminServiceRequestController(req, res, next) {
  try {
    const request = await assignAdminServiceRequest(req.params.requestId, req.body.employeeId, req.user._id);
    await createAuditLog(req.user, "SERVICE_REQUEST_ASSIGNED", {
      targetId: request._id,
      targetType: "ClientRequest",
      metadata: { employeeId: req.body.employeeId, workItemId: request.workItemId },
    });
    emitToUserAndAdmins("data_updated", req.body.employeeId, { action: "request_assigned" });
    return res.success({ request }, "Service request assigned securely to employee");
  } catch (error) {
    return next(error);
  }
}

// ─── Training ─────────────────────────────────────────────────────────────────

export function listAdminTrainingModulesController(req, res, next) {
  try {
    const modules = getAdminTrainingModules();
    return res.success({ modules }, "Training modules fetched");
  } catch (error) {
    return next(error);
  }
}

export function updateAdminTrainingModuleController(req, res, next) {
  try {
    const module = patchAdminTrainingModule(req.params.moduleId, req.body);
    createAuditLog(req.user, "TRAINING_MODULE_UPDATED", {
      targetType: "TrainingModule",
      metadata:   { moduleId: req.params.moduleId, changes: req.body },
    }).catch(() => {}); // fire-and-forget — synchronous service above already succeeded
    return res.success({ module }, "Training module updated");
  } catch (error) {
    return next(error);
  }
}

export async function enrollAdminEmployeeTrainingController(req, res, next) {
  try {
    const enrollment = await enrollAdminEmployeeTraining(
      req.body.employeeId,
      req.body.moduleId,
      req.user._id,
      req.body.note,
    );
    await createAuditLog(req.user, "EMPLOYEE_ENROLLED_TRAINING", {
      targetId: req.body.employeeId,
      targetType: "User",
      metadata: { moduleId: req.body.moduleId, enrollmentId: enrollment._id },
    });
    emitToUserAndAdmins("data_updated", req.body.employeeId, { action: "training_enrolled" });
    return res.success({ enrollment }, "Employee successfully enrolled in training");
  } catch (error) {
    return next(error);
  }
}

// ─── Public Content ───────────────────────────────────────────────────────────

export function getAdminPublicContentController(req, res, next) {
  try {
    const content = getAdminPublicContent();
    return res.success({ content }, "Public content fetched");
  } catch (error) {
    return next(error);
  }
}

export function updateAdminServiceContentController(req, res, next) {
  try {
    const service = patchAdminServiceContent(req.params.slug, req.body);
    createAuditLog(req.user, "SERVICE_CONTENT_UPDATED", {
      targetType: "ServiceContent",
      metadata:   { slug: req.params.slug, changes: req.body },
    }).catch(() => {});
    return res.success({ service }, "Service content updated");
  } catch (error) {
    return next(error);
  }
}

export function updateAdminTrainingContentController(req, res, next) {
  try {
    const training = patchAdminTrainingContent(req.body);
    createAuditLog(req.user, "TRAINING_CONTENT_UPDATED", {
      targetType: "TrainingContent",
      metadata:   { changes: req.body },
    }).catch(() => {});
    return res.success({ training }, "Training content updated");
  } catch (error) {
    return next(error);
  }
}

// ─── Approvals ────────────────────────────────────────────────────────────────

export async function listAdminApprovalsController(req, res, next) {
  try {
    const approvals = await getAdminApprovalQueue();
    return res.success({ approvals }, "Approval queue fetched");
  } catch (error) {
    return next(error);
  }
}

export async function approveAdminWorkItemController(req, res, next) {
  try {
    const workItem = await approveAdminWorkItem(req.user, req.params.workItemId, req.body);
    await createAuditLog(req.user, "WORK_ITEM_APPROVED", {
      targetId:   workItem._id,
      targetType: "WorkItem",
      metadata:   { workItemId: req.params.workItemId, notes: req.body.notes },
    });
    emitToUserAndAdmins("data_updated", workItem.assignedTo, { action: "work_item_approved" });
    return res.success({ workItem }, "Employee work item approved");
  } catch (error) {
    return next(error);
  }
}

export async function rejectAdminWorkItemController(req, res, next) {
  try {
    const workItem = await rejectAdminWorkItem(req.user, req.params.workItemId, req.body);
    await createAuditLog(req.user, "WORK_ITEM_REJECTED", {
      targetId:   workItem._id,
      targetType: "WorkItem",
      metadata:   { workItemId: req.params.workItemId, reason: req.body.reason },
    });
    emitToUserAndAdmins("data_updated", workItem.assignedTo, { action: "work_item_rejected" });
    return res.success({ workItem }, "Employee work item rejected");
  } catch (error) {
    return next(error);
  }
}

// ─── Audit Feed ───────────────────────────────────────────────────────────────

export async function getAdminAuditLogsController(req, res, next) {
  try {
    const { page, limit } = req.query;
    const logs = await getAllAuditLogs({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
    return res.success({ logs }, "Audit logs fetched");
  } catch (error) {
    return next(error);
  }
}
