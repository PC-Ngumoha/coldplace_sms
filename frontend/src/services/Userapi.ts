import { api } from "@/api/client";
import { USER_PATHS } from "@/lib/endpoints";
import type {
  User,
  ProcessResponse,
  CreateUser,
  EditUser,
  UpdatePassword,
} from "@/types";

export const userApi = {
  list: () => api.get<User[]>(USER_PATHS.list).then((r) => r.data),

  retrieve: (id: number) =>
    api.get<User>(`${USER_PATHS.list}/${id}`).then((r) => r.data),

  create: (data: CreateUser) =>
    api.post(USER_PATHS.create, data).then((r) => r.data),

  activate: (id: number) =>
    api
      .post<ProcessResponse>(`${USER_PATHS.list}/${id}/activate`)
      .then((r) => r.data),

  deactivate: (id: number) =>
    api
      .post<ProcessResponse>(`${USER_PATHS.list}/${id}/deactivate`)
      .then((r) => r.data),

  update: (id: number, data: EditUser) =>
    api
      .patch<ProcessResponse>(`${USER_PATHS.create}/${id}`, data)
      .then((r) => r.data),

  changePassword: (id: number, data: UpdatePassword) =>
    api
      .patch<ProcessResponse>(`${USER_PATHS.create}/${id}/changePassword`, data)
      .then((r) => r.data),

  changeMyPassword: (data: UpdatePassword) =>
    api
      .patch<ProcessResponse>(USER_PATHS.changePassword, data)
      .then((r) => r.data),

  delete: (id: number) =>
    api
      .delete<ProcessResponse>(`${USER_PATHS.create}/${id}`)
      .then((r) => r.data),
};
