import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
  useContext,
  useRef,
} from "react";
import { isAxiosError } from "axios";
import { authApi } from "../services/Authapi";
import {
  refreshSession,
  registerOnForcedLogoutHandler,
  setAccessToken,
} from "../api/client";
// import { tokenStorage } from "../api/TokenStorage";
import { sessionHint } from "@/api/Sessionhint";
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
  const [status, setStatus] = useState<AuthStatus>(() =>
    sessionHint.exists() ? "loading" : "unauthenticated",
  );

  const needsBootstrap = useRef(status === "loading"); // Keeps tracking of the auth state we started in.

  // Erases local browser session
  const dropLocalSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Erases session across tabs
  const endSession = useCallback(() => {
    sessionHint.clear();
    dropLocalSession();
  }, [dropLocalSession]);

  // Turns the cookie into a live session in this tab
  const restoreSession = useCallback(
    async (isCancelled: () => boolean = () => false) => {
      try {
        await refreshSession(); // Cross-tab lock occurs internally
        if (isCancelled()) return;
        const me = await authApi.getMe();
        if (isCancelled()) return;
        setUser(me);
        setStatus("authenticated");
      } catch (err) {
        if (isCancelled()) return;
        if (isAxiosError(err) && err.response) {
          endSession(); // End session across all tabs if server rejects.
        } else {
          dropLocalSession(); // Otherwise, just get rid of current tab's session
        }
      }
    },
    [endSession, dropLocalSession],
  );

  // Enables API client have the ability to force a logout if silent refresh fails.
  useEffect(() => {
    registerOnForcedLogoutHandler(endSession);
  }, [endSession]);

  // Bootstrap: Asks the browser if user has ever had a session
  useEffect(() => {
    if (!needsBootstrap.current) return;
    let cancelled = false;
    restoreSession(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [restoreSession]);

  // Cross-tab sync: fires only for session changes made on other tabs.
  useEffect(() => {
    sessionHint.subscribe({
      onSessionEnded: dropLocalSession, // another tab logged out: log out
      onSessionStarted: () => {
        restoreSession(); // another tab logged in: adopt that session
      },
    });
  }, [dropLocalSession, restoreSession]);

  //Login
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { access_token: accessToken } = await authApi.login(credentials);

      setAccessToken(accessToken);
      // tokenStorage.setRefreshToken(refreshToken);

      try {
        // Try to get the user profile.
        const me = await authApi.getMe();
        sessionHint.set();
        setUser(me);
        setStatus("authenticated");
      } catch (err) {
        // If the server already issued a cookie, ask it to clear that.
        await authApi.logout().catch(() => {});
        dropLocalSession();
        throw err;
      }
    },
    [dropLocalSession],
  );

  // Logout
  const logout = useCallback(async () => {
    // const refreshToken = tokenStorage.getRefreshToken();
    try {
      await authApi.logout();
    } catch {
      // Clean token
    } finally {
      endSession();
    }
  }, [endSession]);

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
