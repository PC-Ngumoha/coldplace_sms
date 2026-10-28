import { api, AUTH_PATHS } from "./client";
import type { LoginResponse, LoginCredentials, User } from "@/types";

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>(AUTH_PATHS.login, credentials).then((r) => r.data),

  getMe: () => api.get<User>(AUTH_PATHS.me).then((r) => r.data),

  logout: (refreshToken: string) =>
    api.post(AUTH_PATHS.logout, { refresh_token: refreshToken }),
};
