import httpClient from "./httpClient";

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchClientProfile(token) {
  const response = await httpClient.get("/client/profile", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function updateClientProfile(token, payload) {
  const response = await httpClient.patch("/client/profile", payload, {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchClientRequests(token) {
  const response = await httpClient.get("/client/requests", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function createClientRequest(token, payload) {
  const response = await httpClient.post("/client/requests", payload, {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchClientDocuments(token) {
  const response = await httpClient.get("/client/documents", {
    headers: authHeader(token),
  });
  return response.data;
}
