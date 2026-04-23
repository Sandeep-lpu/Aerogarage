import { ALL_ROLES } from "../../../shared/constants/roles.js";
import {
  findServiceRequestById,
  findUserById,
  listServiceRequests,
  listUsers,
  updateServiceRequest,
  assignServiceRequest,
  enrollEmployeeInTraining,
  updateUser,
} from "../repositories/admin.repository.js";
import {
  getTrainingModules,
  updateTrainingModule,
} from "../../training/services/training.service.js";
import {
  getServicesContent,
  getTrainingContent,
  updateServiceContent,
  updateTrainingContent,
} from "../../public/services/publicContent.service.js";
import {
  approveEmployeeWorkItem,
  getEmployeeApprovalQueue,
  rejectEmployeeWorkItem,
} from "../../employee/services/employee.service.js";

export function getAdminUsers(filters) {
  const query = {};
  const { role, isActive, search, page, limit } = filters;
  if (role) query.role = role;
  if (typeof isActive === "boolean") query.isActive = isActive;
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  return listUsers(query, { page, limit });
}

export async function changeUserRole(userId, role) {
  if (!ALL_ROLES.includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 422;
    throw error;
  }
  const user = await findUserById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return updateUser(userId, { role });
}

export async function changeUserStatus(userId, isActive) {
  const user = await findUserById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return updateUser(userId, { isActive });
}

export function getAdminServiceRequests(filters) {
  const query = {};
  const { status, priority, page, limit } = filters;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  return listServiceRequests(query, { page, limit });
}

export async function updateAdminServiceRequestStatus(requestId, status, adminUserId) {
  const request = await findServiceRequestById(requestId);
  if (!request) {
    const error = new Error("Service request not found");
    error.statusCode = 404;
    throw error;
  }
  
  // Also push to history
  const statusHistory = [...(request.statusHistory || []), {
    status,
    changedBy: adminUserId,
    note: `Status updated by admin`,
    at: new Date()
  }];

  return updateServiceRequest(requestId, { status, statusHistory });
}

export async function assignAdminServiceRequest(requestId, employeeId, adminUserId) {
  try {
    return await assignServiceRequest(requestId, employeeId, adminUserId);
  } catch (err) {
    err.statusCode = err.message.includes("found") ? 404 : 400;
    throw err;
  }
}

export function getAdminTrainingModules() {
  return getTrainingModules();
}

export function patchAdminTrainingModule(moduleId, updates) {
  const moduleItem = updateTrainingModule(moduleId, updates);
  if (!moduleItem) {
    const error = new Error("Training module not found");
    error.statusCode = 404;
    throw error;
  }
  return moduleItem;
}

export async function enrollAdminEmployeeTraining(employeeId, moduleId, adminUserId, note) {
  try {
    return await enrollEmployeeInTraining(employeeId, moduleId, adminUserId, note);
  } catch (err) {
    err.statusCode = err.message.includes("valid employee") ? 404 : 409;
    throw err;
  }
}

export function getAdminPublicContent() {
  return {
    services: getServicesContent(),
    training: getTrainingContent(),
  };
}

export function patchAdminServiceContent(slug, updates) {
  const item = updateServiceContent(slug, updates);
  if (!item) {
    const error = new Error("Public service content not found");
    error.statusCode = 404;
    throw error;
  }
  return item;
}

export function patchAdminTrainingContent(updates) {
  return updateTrainingContent(updates);
}

export function getAdminApprovalQueue() {
  return getEmployeeApprovalQueue();
}

export function approveAdminWorkItem(adminUser, workItemId, payload) {
  return approveEmployeeWorkItem(adminUser, workItemId, payload);
}

export function rejectAdminWorkItem(adminUser, workItemId, payload) {
  return rejectEmployeeWorkItem(adminUser, workItemId, payload);
}
