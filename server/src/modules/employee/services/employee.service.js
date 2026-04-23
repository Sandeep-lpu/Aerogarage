import {
  createEmployeeWorkItem,
  findEmployeeTasksByAssignee,
  findEmployeeUserById,
  findEmployeeWorkItemById,
  findEmployeeWorkItemsByCreator,
  findAssignedServiceRequests,
  findTrainingEnrollments,
  listApprovalQueue,
  updateEmployeeProfile,
  updateEmployeeWorkItem,
} from "../repositories/employee.repository.js";
import { getTrainingModules } from "../../training/services/training.service.js";

function createAuditEvent(event, actorId, note = "") {
  return {
    event,
    actorId,
    note,
    at: new Date(),
  };
}

function assertOwnership(workItem, userId) {
  const owns = String(workItem.createdBy) === String(userId) || String(workItem.assignedTo) === String(userId);
  if (!owns) {
    const error = new Error("You can only manage your own assigned work items");
    error.statusCode = 403;
    throw error;
  }
}

export function getEmployeeDashboard(userId, user) {
  return Promise.all([
    findEmployeeWorkItemsByCreator(userId),
    findEmployeeTasksByAssignee(userId),
    findAssignedServiceRequests(userId),
  ]).then(([requests, tasks, assignedRequests]) => {
    const pendingApproval = requests.filter((item) => ["submitted", "under_review"].includes(item.status)).length;
    const approved = requests.filter((item) => item.status === "approved").length;
    const inExecution = tasks.filter((item) => item.status === "executed").length;
    const closed = tasks.filter((item) => item.status === "closed").length;

    return {
      employeeName: user?.fullName || user?.email || "Employee",
      summary: {
        totalRequests: requests.length,
        pendingApproval,
        approved,
        inExecution,
        closed,
        assignedClientRequests: assignedRequests.length,
      },
    };
  });
}

export async function createWorkItem(user, payload) {
  return createEmployeeWorkItem({
    title: payload.title,
    type: payload.type,
    priority: payload.priority || "medium",
    description: payload.description,
    approvalRequired: payload.approvalRequired !== false,
    createdBy: user.id,
    assignedTo: user.id,
    dueDate: payload.dueDate || null,
    auditTrail: [createAuditEvent("draft_created", user.id, "Draft created by employee")],
  });
}

export function getEmployeeRequests(userId) {
  return findEmployeeWorkItemsByCreator(userId);
}

export function getEmployeeAssignedRequests(userId) {
  return findAssignedServiceRequests(userId);
}

export function getEmployeeTasks(userId) {
  return findEmployeeTasksByAssignee(userId);
}

export async function getEmployeeTrainingEnrollments(userId) {
  const enrollments = await findTrainingEnrollments(userId);
  const modules = getTrainingModules() || [];

  return enrollments.map((enr) => {
    const rawEnr = enr.toJSON();
    const modDef = modules.find((m) => m.id === rawEnr.moduleId);
    return {
      ...rawEnr,
      moduleInfo: modDef || { title: "Unknown Module", code: "N/A" },
    };
  });
}

export async function submitEmployeeRequest(userId, workItemId) {
  const workItem = await findEmployeeWorkItemById(workItemId);
  if (!workItem) {
    const error = new Error("Work item not found");
    error.statusCode = 404;
    throw error;
  }

  assertOwnership(workItem, userId);

  if (!["draft", "rejected"].includes(workItem.status)) {
    const error = new Error("Only draft or rejected items can be submitted");
    error.statusCode = 422;
    throw error;
  }

  const nextTrail = [...(workItem.auditTrail || []), createAuditEvent("submitted", userId, "Submitted for admin approval")];

  return updateEmployeeWorkItem(workItemId, {
    status: "submitted",
    approvalNote: "",
    approvedBy: null,
    adminDecisionAt: null,
    auditTrail: nextTrail,
  });
}

export async function updateEmployeeTask(userId, workItemId, updates) {
  const workItem = await findEmployeeWorkItemById(workItemId);
  if (!workItem) {
    const error = new Error("Work item not found");
    error.statusCode = 404;
    throw error;
  }

  assertOwnership(workItem, userId);

  if (workItem.approvalRequired && !["approved", "executed", "closed"].includes(workItem.status)) {
    const error = new Error("Admin approval required before execution changes");
    error.statusCode = 403;
    throw error;
  }

  const next = {};
  if (typeof updates.status === "string") next.status = updates.status;
  if (typeof updates.description === "string") next.description = updates.description;
  if (typeof updates.priority === "string") next.priority = updates.priority;

  const note = updates.note || "Employee updated task";
  const nextTrail = [...(workItem.auditTrail || []), createAuditEvent("task_updated", userId, note)];
  next.auditTrail = nextTrail;

  return updateEmployeeWorkItem(workItemId, next);
}

export function getEmployeeDocuments(user) {
  const owner = user?.fullName || user?.email || "Employee";
  return [
    {
      id: "EMP-DOC-001",
      title: "Shift Handover Log",
      type: "PDF",
      updatedAt: new Date().toISOString(),
      owner,
    },
    {
      id: "EMP-DOC-002",
      title: "Operations Task Checklist",
      type: "XLSX",
      updatedAt: new Date().toISOString(),
      owner,
    },
  ];
}

export function getEmployeeProfile(userId) {
  return findEmployeeUserById(userId);
}

export function saveEmployeeProfile(userId, updates) {
  return updateEmployeeProfile(userId, updates);
}

export async function getEmployeeApprovalQueue() {
  return listApprovalQueue();
}

export async function approveEmployeeWorkItem(adminUser, workItemId, payload) {
  const workItem = await findEmployeeWorkItemById(workItemId);
  if (!workItem) {
    const error = new Error("Work item not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(adminUser.role) !== "admin") {
    const error = new Error("Only admin can approve employee requests");
    error.statusCode = 403;
    throw error;
  }

  if (!["submitted", "under_review"].includes(workItem.status)) {
    const error = new Error("Only submitted/under_review items can be approved");
    error.statusCode = 422;
    throw error;
  }

  const note = payload?.note || "Approved by admin";
  const nextTrail = [...(workItem.auditTrail || []), createAuditEvent("approved", adminUser.id, note)];

  return updateEmployeeWorkItem(workItemId, {
    status: "approved",
    approvedBy: adminUser.id,
    approvalNote: note,
    adminDecisionAt: new Date(),
    auditTrail: nextTrail,
  });
}

export async function rejectEmployeeWorkItem(adminUser, workItemId, payload) {
  const workItem = await findEmployeeWorkItemById(workItemId);
  if (!workItem) {
    const error = new Error("Work item not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(adminUser.role) !== "admin") {
    const error = new Error("Only admin can reject employee requests");
    error.statusCode = 403;
    throw error;
  }

  if (!["submitted", "under_review"].includes(workItem.status)) {
    const error = new Error("Only submitted/under_review items can be rejected");
    error.statusCode = 422;
    throw error;
  }

  const note = payload?.note || "Rejected by admin";
  const nextTrail = [...(workItem.auditTrail || []), createAuditEvent("rejected", adminUser.id, note)];

  return updateEmployeeWorkItem(workItemId, {
    status: "rejected",
    approvedBy: adminUser.id,
    approvalNote: note,
    adminDecisionAt: new Date(),
    auditTrail: nextTrail,
  });
}
