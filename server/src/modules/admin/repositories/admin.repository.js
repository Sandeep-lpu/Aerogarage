import ClientRequest from "../../../shared/models/clientRequest.model.js";
import User from "../../../shared/models/user.model.js";
import EmployeeWorkItem from "../../../shared/models/employeeWorkItem.model.js";
import TrainingEnrollment from "../../../shared/models/trainingEnrollment.model.js";

// ─── Pagination helper ────────────────────────────────────────────────────────
function buildPagination(page = 1, limit = 25) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 25)); // cap at 100
  return { skip: (p - 1) * l, limit: l, page: p };
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function listUsers(filters, { page, limit } = {}) {
  const q = User.find(filters)
    .select("fullName email role isActive createdAt updatedAt")
    .sort({ createdAt: -1 });

  if (page !== undefined) {
    const pg = buildPagination(page, limit);
    const [users, total] = await Promise.all([
      q.skip(pg.skip).limit(pg.limit).lean(),
      User.countDocuments(filters),
    ]);
    return { users, total, page: pg.page, limit: pg.limit };
  }

  return { users: await q.lean() };
}

export function findUserById(userId) {
  return User.findById(userId).select("fullName email role isActive createdAt updatedAt");
}

export function updateUser(userId, updates) {
  return User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true })
    .select("fullName email role isActive createdAt updatedAt");
}

// ─── Service Requests ─────────────────────────────────────────────────────────
export async function listServiceRequests(filters = {}, { page, limit } = {}) {
  const q = ClientRequest.find(filters)
    .sort({ createdAt: -1 })
    .populate("userId", "fullName email role");

  if (page !== undefined) {
    const pg = buildPagination(page, limit);
    const [requests, total] = await Promise.all([
      q.skip(pg.skip).limit(pg.limit).lean(),
      ClientRequest.countDocuments(filters),
    ]);
    return { requests, total, page: pg.page, limit: pg.limit };
  }

  return { requests: await q.lean() };
}

export function findServiceRequestById(requestId) {
  return ClientRequest.findById(requestId).populate("userId", "fullName email role");
}

export async function updateServiceRequest(requestId, updates) {
  const request = await ClientRequest.findByIdAndUpdate(
    requestId,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate("userId", "fullName email role");

  // If status is completed or cancelled, sync it down to the WorkItem if it exists
  if (request && (updates.status === "completed" || updates.status === "cancelled")) {
    if (request.workItemId) {
      const workItemStatus = updates.status === "completed" ? "closed" : "rejected";
      await EmployeeWorkItem.findByIdAndUpdate(request.workItemId, { status: workItemStatus });
    }
  }

  return request;
}

export async function assignServiceRequest(requestId, employeeId, adminUserId) {
  const request = await ClientRequest.findById(requestId);
  if (!request) throw new Error("Service request not found");

  const employee = await User.findById(employeeId);
  if (!employee || employee.role !== "employee") {
    throw new Error("Target user is not a valid employee");
  }

  // 1. Create the auto-linked WorkItem
  const workItem = await EmployeeWorkItem.create({
    title: `[Assigned] ${request.title}`,
    type: request.serviceType,
    priority: request.priority,
    description: request.description,
    status: "approved", // auto-approve admin assignments
    approvalRequired: false,
    createdBy: adminUserId,
    assignedTo: employeeId,
    clientRequestId: request._id,
    auditTrail: [
      {
        event: "WORK_ITEM_AUTO_CREATED",
        actorId: adminUserId,
        note: `Auto-generated from Client Request ${request._id}`,
      },
    ],
  });

  // 2. Link ClientRequest back to the WorkItem and Employee
  request.assignedEmployeeId = employeeId;
  request.workItemId = workItem._id;
  request.status = "in_progress"; // State transition
  request.statusHistory.push({
    status: "in_progress",
    changedBy: adminUserId,
    note: `Assigned to employee ${employee.fullName}`,
  });

  await request.save();
  return request.populate("userId", "fullName email role");
}

export async function enrollEmployeeInTraining(employeeId, moduleId, adminUserId, note) {
  const employee = await User.findById(employeeId);
  if (!employee || employee.role !== "employee") {
    throw new Error("Target user is not a valid employee");
  }

  try {
    const enrollment = await TrainingEnrollment.create({
      employeeId,
      moduleId,
      enrolledBy: adminUserId,
      enrollmentNote: note,
    });
    return enrollment;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Employee is already enrolled in this module");
    }
    throw error;
  }
}
