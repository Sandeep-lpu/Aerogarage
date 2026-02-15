import ClientRequest from "../../../shared/models/clientRequest.model.js";
import User from "../../../shared/models/user.model.js";

export function listUsers(filters) {
  return User.find(filters)
    .select("fullName email role isActive createdAt updatedAt")
    .sort({ createdAt: -1 });
}

export function findUserById(userId) {
  return User.findById(userId).select("fullName email role isActive createdAt updatedAt");
}

export function updateUser(userId, updates) {
  return User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true })
    .select("fullName email role isActive createdAt updatedAt");
}

export function listServiceRequests(filters = {}) {
  return ClientRequest.find(filters)
    .sort({ createdAt: -1 })
    .populate("userId", "fullName email role");
}

export function findServiceRequestById(requestId) {
  return ClientRequest.findById(requestId).populate("userId", "fullName email role");
}

export function updateServiceRequest(requestId, updates) {
  return ClientRequest.findByIdAndUpdate(requestId, { $set: updates }, { new: true, runValidators: true })
    .populate("userId", "fullName email role");
}
