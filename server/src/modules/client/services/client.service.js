import {
  createClientRequest,
  findClientRequestsByUser,
  findClientUserById,
  updateClientUserProfile,
} from "../repositories/client.repository.js";

export function submitClientRequest(payload) {
  return createClientRequest(payload);
}

export function getClientRequests(userId) {
  return findClientRequestsByUser(userId);
}

export function getClientProfile(userId) {
  return findClientUserById(userId);
}

export function saveClientProfile(userId, updates) {
  return updateClientUserProfile(userId, updates);
}

export function getClientDocuments(user) {
  const name = user?.fullName || "Client";
  return [
    {
      id: "DOC-001",
      title: "Service Capability Profile",
      type: "PDF",
      updatedAt: new Date().toISOString(),
      owner: name,
    },
    {
      id: "DOC-002",
      title: "Monthly Operations Summary",
      type: "XLSX",
      updatedAt: new Date().toISOString(),
      owner: name,
    },
  ];
}
