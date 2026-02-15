import { ALL_ROLES } from "../../../shared/constants/roles.js";
import {
  findServiceRequestById,
  findUserById,
  listServiceRequests,
  listUsers,
  updateServiceRequest,
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

export function getAdminUsers(filters) {
  const query = {};
  if (filters.role) query.role = filters.role;
  if (typeof filters.isActive === "boolean") query.isActive = filters.isActive;
  if (filters.search) {
    query.$or = [
      { fullName: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }
  return listUsers(query);
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
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  return listServiceRequests(query);
}

export async function updateAdminServiceRequestStatus(requestId, status) {
  const request = await findServiceRequestById(requestId);
  if (!request) {
    const error = new Error("Service request not found");
    error.statusCode = 404;
    throw error;
  }
  return updateServiceRequest(requestId, { status });
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
