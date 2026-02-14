import httpClient from "../api/httpClient";

export async function login(payload) {
  const response = await httpClient.post("/auth/login", payload);
  return response.data;
}

export async function register(payload) {
  const response = await httpClient.post("/auth/register", payload);
  return response.data;
}

export async function refresh(refreshToken) {
  const response = await httpClient.post("/auth/refresh", { refreshToken });
  return response.data;
}

export async function logout(refreshToken) {
  const response = await httpClient.post("/auth/logout", { refreshToken });
  return response.data;
}

export async function me(accessToken) {
  const response = await httpClient.get("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}
