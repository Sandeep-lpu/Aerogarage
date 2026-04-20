import httpClient from "./httpClient";

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchEmployeeDashboard(token) {
  const response = await httpClient.get("/employee/dashboard", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchEmployeeProfile(token) {
  const response = await httpClient.get("/employee/profile", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function updateEmployeeProfile(token, payload) {
  const response = await httpClient.patch("/employee/profile", payload, {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchEmployeeRequests(token) {
  const response = await httpClient.get("/employee/requests", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchEmployeeAssignedRequests(token) {
  const response = await httpClient.get("/employee/assigned-requests", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchEmployeeTrainingEnrollments(token) {
  const response = await httpClient.get("/employee/training-enrollments", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function createEmployeeRequest(token, payload) {
  const response = await httpClient.post("/employee/requests", payload, {
    headers: authHeader(token),
  });
  return response.data;
}

export async function submitEmployeeRequest(token, workItemId) {
  const response = await httpClient.patch(
    `/employee/requests/${workItemId}/submit`,
    {},
    { headers: authHeader(token) },
  );
  return response.data;
}

export async function fetchEmployeeTasks(token) {
  const response = await httpClient.get("/employee/tasks", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function updateEmployeeTask(token, workItemId, payload) {
  const response = await httpClient.patch(`/employee/tasks/${workItemId}`, payload, {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchEmployeeDocuments(token) {
  const response = await httpClient.get("/employee/documents", {
    headers: authHeader(token),
  });
  return response.data;
}
