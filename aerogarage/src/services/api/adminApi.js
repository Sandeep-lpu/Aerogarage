import httpClient from "./httpClient";

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchAdminUsers(token) {
  const response = await httpClient.get("/admin/users", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function updateAdminUserRole(token, userId, role) {
  const response = await httpClient.patch(
    `/admin/users/${userId}/role`,
    { role },
    { headers: authHeader(token) },
  );
  return response.data;
}

export async function updateAdminUserStatus(token, userId, isActive) {
  const response = await httpClient.patch(
    `/admin/users/${userId}/status`,
    { isActive },
    { headers: authHeader(token) },
  );
  return response.data;
}

export async function fetchAdminRequests(token) {
  const response = await httpClient.get("/admin/requests", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function updateAdminRequestStatus(token, requestId, status) {
  const response = await httpClient.patch(
    `/admin/requests/${requestId}/status`,
    { status },
    { headers: authHeader(token) },
  );
  return response.data;
}

export async function fetchAdminTrainingModules(token) {
  const response = await httpClient.get("/admin/training/modules", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function updateAdminTrainingModule(token, moduleId, payload) {
  const response = await httpClient.patch(
    `/admin/training/modules/${moduleId}`,
    payload,
    { headers: authHeader(token) },
  );
  return response.data;
}

export async function enrollAdminTraining(token, payload) {
  const response = await httpClient.post(
    "/admin/training/enroll",
    payload,
    { headers: authHeader(token) },
  );
  return response.data;
}

export async function fetchAdminPublicContent(token) {
  const response = await httpClient.get("/admin/content/public", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function updateAdminServiceContent(token, slug, payload) {
  const response = await httpClient.patch(
    `/admin/content/public/services/${slug}`,
    payload,
    { headers: authHeader(token) },
  );
  return response.data;
}

export async function updateAdminTrainingContent(token, payload) {
  const response = await httpClient.patch(
    "/admin/content/public/training",
    payload,
    { headers: authHeader(token) },
  );
  return response.data;
}

export async function fetchAdminApprovals(token) {
  const response = await httpClient.get("/admin/approvals", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function approveAdminWorkItem(token, workItemId, note = "") {
  const response = await httpClient.patch(
    `/admin/approvals/${workItemId}/approve`,
    { note },
    { headers: authHeader(token) },
  );
  return response.data;
}

export async function rejectAdminWorkItem(token, workItemId, note = "") {
  const response = await httpClient.patch(
    `/admin/approvals/${workItemId}/reject`,
    { note },
    { headers: authHeader(token) },
  );
  return response.data;
}

export async function fetchAdminAuditLogs(token) {
  const response = await httpClient.get("/admin/audit-logs", {
    headers: authHeader(token),
  });
  return response.data;
}

export async function fetchAdminAnalytics(token) {
  const response = await httpClient.get("/analytics/dashboard", {
    headers: authHeader(token),
  });
  return response.data;
}
