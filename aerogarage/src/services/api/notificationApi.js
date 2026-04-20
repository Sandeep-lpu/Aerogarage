import httpClient from "./httpClient";

export async function fetchNotifications() {
  const response = await httpClient.get("/notifications");
  return response.data;
}

export async function markNotificationRead(id) {
  const url = id ? `/notifications/${id}/read` : "/notifications/read-all";
  const response = await httpClient.patch(url);
  return response.data;
}
