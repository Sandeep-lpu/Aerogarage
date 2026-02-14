import ClientRequest from "../../../shared/models/clientRequest.model.js";
import User from "../../../shared/models/user.model.js";

export function createClientRequest(payload) {
  return ClientRequest.create(payload);
}

export function findClientRequestsByUser(userId) {
  return ClientRequest.find({ userId }).sort({ createdAt: -1 });
}

export function findClientUserById(userId) {
  return User.findById(userId).select("fullName email role isActive createdAt");
}

export function updateClientUserProfile(userId, updates) {
  return User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true },
  ).select("fullName email role isActive createdAt");
}
