import httpClient from "./httpClient";

export async function submitContactInquiry(payload) {
  const response = await httpClient.post("/public/inquiries/contact", payload);
  return response.data;
}

export async function submitCareerApplication(payload) {
  const response = await httpClient.post("/public/applications/careers", payload);
  return response.data;
}

export async function fetchServicesContent() {
  const response = await httpClient.get("/public/content/services");
  return response.data;
}

export async function fetchTrainingContent() {
  const response = await httpClient.get("/public/content/training");
  return response.data;
}

export function parseApiError(error) {
  if (error?.response?.data) {
    return {
      message: error.response.data.message || "Request failed",
      details: error.response.data.error || null,
      status: error.response.status,
    };
  }

  if (error?.message) {
    return { message: error.message, details: null, status: 0 };
  }

  return { message: "Unexpected error", details: null, status: 0 };
}

export function mapValidationErrors(details) {
  if (!Array.isArray(details)) return {};

  return details.reduce((acc, item) => {
    if (item?.path && !acc[item.path]) {
      acc[item.path] = item.msg || "Invalid value";
    }
    return acc;
  }, {});
}
