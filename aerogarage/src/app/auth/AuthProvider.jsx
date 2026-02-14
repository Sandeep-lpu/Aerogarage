import { useCallback, useEffect, useRef, useState } from "react";
import {
  login as loginApi,
  logout as logoutApi,
  refresh as refreshApi,
} from "../../services/auth/authApi";
import { clearAuthState, loadAuthState, saveAuthState } from "../../services/auth/authStorage";
import { parseApiError } from "../../services/api/publicApi";
import { AuthContext } from "./authContext";

function getTokenExpiryMs(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.exp ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

function isTokenExpired(token, skewMs = 5000) {
  const expiry = getTokenExpiryMs(token);
  if (!expiry) return true;
  return Date.now() >= (expiry - skewMs);
}

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => loadAuthState());
  const [authLoading, setAuthLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const authRef = useRef(authState);

  useEffect(() => {
    authRef.current = authState;
  }, [authState]);

  const persistSession = useCallback((nextState) => {
    setAuthState(nextState);
    saveAuthState(nextState);
  }, []);

  const clearSession = useCallback(() => {
    clearAuthState();
    setAuthState(null);
  }, []);

  const login = async (payload) => {
    setAuthLoading(true);

    try {
      const response = await loginApi(payload);
      const nextState = {
        accessToken: response?.data?.accessToken,
        refreshToken: response?.data?.refreshToken,
        user: response?.data?.user,
      };

      persistSession(nextState);
      return { ok: true, data: response?.data };
    } catch (error) {
      return { ok: false, error: parseApiError(error) };
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshSession = useCallback(async (refreshTokenOverride) => {
    const refreshToken = refreshTokenOverride || authRef.current?.refreshToken;
    if (!refreshToken) {
      return { ok: false, error: { message: "No refresh token" } };
    }

    try {
      const response = await refreshApi(refreshToken);
      const nextState = {
        accessToken: response?.data?.accessToken,
        refreshToken: response?.data?.refreshToken,
        user: response?.data?.user,
      };

      persistSession(nextState);
      return { ok: true, data: response?.data };
    } catch (error) {
      clearSession();
      return { ok: false, error: parseApiError(error) };
    }
  }, [clearSession, persistSession]);

  const logout = useCallback(async () => {
    const refreshToken = authRef.current?.refreshToken;

    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch {
      // Best-effort API logout only.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    let mounted = true;

    async function hydrateSession() {
      const snapshot = authRef.current;
      if (!snapshot?.accessToken) {
        if (mounted) setSessionReady(true);
        return;
      }

      if (!isTokenExpired(snapshot.accessToken)) {
        if (mounted) setSessionReady(true);
        return;
      }

      const refreshed = await refreshSession(snapshot.refreshToken);
      if (!mounted) return;
      if (!refreshed.ok) {
        clearSession();
      }
      setSessionReady(true);
    }

    setSessionReady(false);
    hydrateSession();

    return () => {
      mounted = false;
    };
  }, [authState?.accessToken, authState?.refreshToken, clearSession, refreshSession]);

  useEffect(() => {
    const snapshot = authRef.current;
    if (!snapshot?.accessToken || !snapshot?.refreshToken) {
      return undefined;
    }

    const expiryMs = getTokenExpiryMs(snapshot.accessToken);
    if (!expiryMs) {
      return undefined;
    }

    const refreshInMs = Math.max(expiryMs - Date.now() - 60000, 5000);
    const timer = setTimeout(async () => {
      const refreshed = await refreshSession(snapshot.refreshToken);
      if (!refreshed.ok) {
        await logout();
      }
    }, refreshInMs);

    return () => clearTimeout(timer);
  }, [authState?.accessToken, authState?.refreshToken, logout, refreshSession]);

  const isAuthenticated =
    sessionReady &&
    Boolean(authState?.accessToken && authState?.user) &&
    !isTokenExpired(authState?.accessToken || "");

  const hasRole = (...roles) => {
    if (!authState?.user?.role) return false;
    const userRole = String(authState.user.role).toLowerCase();
    return roles.map((r) => String(r).toLowerCase()).includes(userRole);
  };

  const withAuthRequest = async (requestFn) => {
    const snapshot = authRef.current;
    if (!snapshot?.accessToken) {
      throw new Error("Authentication required");
    }

    let token = snapshot.accessToken;

    if (isTokenExpired(token)) {
      const refreshed = await refreshSession(snapshot.refreshToken);
      if (!refreshed.ok || !refreshed.data?.accessToken) {
        throw new Error("Session expired. Please sign in again.");
      }
      token = refreshed.data.accessToken;
    }

    try {
      return await requestFn(token);
    } catch (error) {
      if (error?.response?.status === 401) {
        const refreshed = await refreshSession(authRef.current?.refreshToken);
        if (!refreshed.ok || !refreshed.data?.accessToken) {
          throw new Error("Session expired. Please sign in again.");
        }
        return requestFn(refreshed.data.accessToken);
      }
      throw error;
    }
  };

  const value = {
    authState,
    authLoading,
    sessionReady,
    isAuthenticated,
    login,
    logout,
    refreshSession,
    withAuthRequest,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
