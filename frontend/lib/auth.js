export const ADMIN_TOKEN_STORAGE_KEY = "atelier-market-admin-token";
export const ADMIN_TOKEN_COOKIE = "atelier_market_admin_token";

export function getAdminToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
}

export function setAdminToken(token) {
  if (typeof window === "undefined" || !token) {
    return;
  }

  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  document.cookie = `${ADMIN_TOKEN_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

export function clearAdminToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  document.cookie = `${ADMIN_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
