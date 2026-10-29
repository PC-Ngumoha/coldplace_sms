import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
  useContext,
} from "react";
import { authApi } from "../services/Authapi";
import {
  refreshSession,
  registerOnForcedLogoutHandler,
  setAccessToken,
} from "../api/client";
import { tokenStorage } from "../api/TokenStorage";
import type { AuthStatus, LoginCredentials, User } from "../types";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Erases everything locally
  const clearSession = useCallback(() => {
    setAccessToken(null);
    tokenStorage.clear();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Enables API client have the ability to force a logout if silent refresh fails.
  useEffect(() => {
    registerOnForcedLogoutHandler(clearSession);
  }, [clearSession]);

  // Turn a surviving refresh token into a live session
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!tokenStorage.getRefreshToken()) {
        setStatus("unauthenticated");
        return;
      }

      try {
        await refreshSession();
        const me = await authApi.getMe();

        if (cancelled) return;
        setUser(me);
        setStatus("authenticated");
      } catch {
        if (!cancelled) clearSession();
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  // Cross-tab logout: log out in a browser tab should trigger logout in other tabs.
  // This event will only be triggered in instances of the website running on other tabs.
  useEffect(() => {
    const onStorage = (evt: StorageEvent) => {
      if (evt.key === tokenStorage.key && evt.newValue === null) {
        setAccessToken(null);
        setUser(null);
        setStatus("unauthenticated");
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  //Login
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { access_token: accessToken, refresh_token: refreshToken } =
        await authApi.login(credentials);

      setAccessToken(accessToken);
      tokenStorage.setRefreshToken(refreshToken);

      try {
        // Try to get the user profile.
        const me = await authApi.getMe();
        setUser(me);
        setStatus("authenticated");
      } catch (err) {
        clearSession(); // Prevents half-logged in states.
        throw err;
      }
    },
    [clearSession],
  );

  // Logout
  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Clean token
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, status, login, logout }),
    [user, status, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
