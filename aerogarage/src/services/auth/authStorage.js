const STORAGE_KEY = "aerogarage_auth";

export function loadAuthState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAuthState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearAuthState() {
  localStorage.removeItem(STORAGE_KEY);
}
