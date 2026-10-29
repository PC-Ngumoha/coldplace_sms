import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./TokenStorage";
import { type LoginResponse } from "@/types";
import { AUTH_PATHS } from "@/lib/endpoints";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

// Endpoints

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
export const api = axios.create({ baseURL: BASE_URL });

// Bare instance: Used internally for silent refresh. Has no interceptors
const bareApi = axios.create({ baseURL: BASE_URL });

/** ----------- Single flight Refresh ------------ */
let refreshPromise: Promise<string> | null = null;

export function refreshSession(): Promise<string> {
  // If a refresh in progress, halt others.
  if (refreshPromise) return refreshPromise;

  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return Promise.reject(new Error("No refresh token"));

  refreshPromise = bareApi
    .post<LoginResponse>(AUTH_PATHS.refresh, { refresh_token: refreshToken })
    .then((res) => {
      setAccessToken(res.data.access_token);
      tokenStorage.setRefreshToken(res.data.refresh_token);
      return res.data.access_token;
    })
    .finally(() => {
      refreshPromise = null;
    });

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

    // Was the call made to an Authentication route like login or refresh ?
    const isAuthCall =
      originalReq?.url === AUTH_PATHS.login ||
      originalReq?.url === AUTH_PATHS.refresh;

    // Terminating conditions: Prevent an infinite loop
    if (
      !originalReq ||
      error.response?.status !== 401 ||
      originalReq._retry ||
      isAuthCall
    ) {
      return Promise.reject(error);
    }

    originalReq._retry = true;

    try {
      const newAccessToken = await refreshSession();
      originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalReq); // retry request
    } catch (refreshError) {
      onForcedLogout();
      return Promise.reject(refreshError);
    }
  },
);
