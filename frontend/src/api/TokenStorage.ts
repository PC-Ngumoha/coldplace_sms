/**
 * Handle all storage and direct interaction with the Refresh token.
 */

const REFRESH = "refresh_token";

export const tokenStorage = {
  getRefreshToken(): string | null {
    try {
      return window.localStorage.getItem(REFRESH);
    } catch {
      return null;
    }
  },

  setRefreshToken(value: string): void {
    try {
      window.localStorage.setItem(REFRESH, value);
    } catch {
      // Do nothing
    }
  },

  clear(): void {
    try {
      window.localStorage.removeItem(REFRESH);
    } catch {
      // Do nothing
    }
  },

  key: REFRESH,
};
