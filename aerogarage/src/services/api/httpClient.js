import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Token accessor (set by AuthProvider after it mounts) ────────────────────
// We store a getter function rather than the token value directly so we always
// read the latest in-memory token without creating a circular module dependency.
let _getAccessToken = () => null;
let _onUnauthorized = null; // callback AuthProvider sets to trigger silent refresh

export function registerTokenAccessor(getTokenFn, onUnauthorizedFn) {
  _getAccessToken = getTokenFn;
  _onUnauthorized = onUnauthorizedFn;
}

// ─── Request interceptor ─────────────────────────────────────────────────────
// Automatically injects Authorization header on every outbound request.
// Individual callers no longer need to pass the token manually.
httpClient.interceptors.request.use(
  (config) => {
    const token = _getAccessToken();
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor ────────────────────────────────────────────────────
// On a 401, attempt a silent token refresh and replay the original request once.
// If the refresh fails (or this is already a retry), the error propagates normally.
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error?.response?.status === 401;
    const isRetry = originalRequest?._retry;
    const canRefresh = typeof _onUnauthorized === "function";

    if (isUnauthorized && !isRetry && canRefresh) {
      originalRequest._retry = true;

      try {
        const newToken = await _onUnauthorized(); // triggers refreshSession() in AuthProvider
        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return httpClient(originalRequest);
        }
      } catch {
        // Refresh failed — let the error propagate so callers can redirect to login
      }
    }

    return Promise.reject(error);
  },
);

export default httpClient;
