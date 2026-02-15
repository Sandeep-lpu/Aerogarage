import httpClient from "./httpClient";

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchTrainingDashboard(token) {
  const response = await httpClient.get("/training/dashboard", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchTrainingModules(token) {
  const response = await httpClient.get("/training/modules", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchTrainingExams(token) {
  const response = await httpClient.get("/training/exams", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchTrainingResources(token) {
  const response = await httpClient.get("/training/resources", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function downloadTrainingResource(token, resourceId) {
  const response = await httpClient.get(`/training/resources/${resourceId}/download`, {
    headers: authHeader(token),
    responseType: "blob",
  });
  return response;
}
