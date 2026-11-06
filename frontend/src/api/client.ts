import axios, {
  AxiosError,
  isAxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
// import { tokenStorage } from "./TokenStorage";
import { type LoginResponse } from "@/types";
import { AUTH_PATHS } from "@/lib/endpoints";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const NO_REFRESH_PATHS = [
  AUTH_PATHS.login,
  AUTH_PATHS.logout,
  AUTH_PATHS.refresh,
];

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (value: string | null) => {
  accessToken = value;
};

// Used by the AuthContext to force a logout
let onForcedLogout: () => void = () => {};
export const registerOnForcedLogoutHandler = (fn: () => void) => {
  onForcedLogout = fn;
};

// Main axios instance. Has interceptors
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "X-Requested-With": "axios",
  },
});

// Bare instance: Used internally for silent refresh. Has no interceptors
const bareApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10_000,
  headers: {
    "X-Requested-With": "axios",
  },
});

/**----- Refresh: Single flight per tab, serialized across tabs */
const LOCK_NAME = "auth-refresh";

async function requestNewAccessToken(): Promise<string> {
  const res = await bareApi.post<LoginResponse>(AUTH_PATHS.refresh);
  setAccessToken(res.data.access_token);
  return res.data.access_token;
}

// locked into refreshing one tab at a time, other tabs queue & run in turn
function withCrossTabLock<T>(fn: () => Promise<T>): Promise<T> {
  if (typeof navigator !== "undefined" && "locks" in navigator) {
    return navigator.locks.request(LOCK_NAME, fn);
  }

  return fn(); // Older browsers that don't support web locks.
}

let refreshPromise: Promise<string> | null = null;

export function refreshSession(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = withCrossTabLock(requestNewAccessToken).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

/**----------- interceptors -------------- */

// Applied on every request sent.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry: boolean;
};

// On 401: retry once, refresh once.
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    // retrieve original request
    const originalReq = error.config as RetryableConfig | undefined;

    // Terminating conditions: Prevent an infinite loop
    if (
      !originalReq ||
      error.response?.status !== 401 ||
      originalReq._retry ||
      NO_REFRESH_PATHS.includes(originalReq.url ?? "")
    ) {
      return Promise.reject(error);
    }

    originalReq._retry = true;

    try {
      const newAccessToken = await refreshSession();
      originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalReq); // retry request
    } catch (refreshError) {
      if (isAxiosError(refreshError) && refreshError.response) {
        onForcedLogout();
      }
      return Promise.reject(refreshError);
    }
  },
);
