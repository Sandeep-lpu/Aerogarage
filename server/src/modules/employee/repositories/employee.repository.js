import EmployeeWorkItem from "../../../shared/models/employeeWorkItem.model.js";
import User from "../../../shared/models/user.model.js";
import ClientRequest from "../../../shared/models/clientRequest.model.js";
import TrainingEnrollment from "../../../shared/models/trainingEnrollment.model.js";

export function createEmployeeWorkItem(payload) {
  return EmployeeWorkItem.create(payload);
}

export function findEmployeeWorkItemsByCreator(userId) {
  return EmployeeWorkItem.find({ createdBy: userId }).sort({ createdAt: -1 });
}

export function findAssignedServiceRequests(employeeId) {
  return ClientRequest.find({ assignedEmployeeId: employeeId })
    .sort({ updatedAt: -1 })
    .populate("userId", "fullName email");
}

export function findTrainingEnrollments(employeeId) {
  return TrainingEnrollment.find({ employeeId })
    .sort({ createdAt: -1 })
    .populate("enrolledBy", "fullName email");
}

export function findEmployeeTasksByAssignee(userId) {
  return EmployeeWorkItem.find({
    assignedTo: userId,
    status: { $in: ["submitted", "under_review", "approved", "rejected", "executed"] },
  }).sort({ updatedAt: -1 });
}

export function findEmployeeWorkItemById(workItemId) {
  return EmployeeWorkItem.findById(workItemId);
}

export function updateEmployeeWorkItem(workItemId, updates) {
  return EmployeeWorkItem.findByIdAndUpdate(
    workItemId,
    { $set: updates },
    { new: true, runValidators: true },
  );
}

export function listApprovalQueue() {
  return EmployeeWorkItem.find({ status: { $in: ["submitted", "under_review"] } })
    .sort({ createdAt: -1 })
    .populate("createdBy", "fullName email role")
    .populate("assignedTo", "fullName email role");
}

export function findEmployeeUserById(userId) {
  return User.findById(userId)
    .select("fullName email role isActive department designation shift createdAt");
}

export function updateEmployeeProfile(userId, updates) {
  return User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true },
  ).select("fullName email role isActive department designation shift createdAt");
}
