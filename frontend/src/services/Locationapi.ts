import { api } from "@/api/client";
import { LOCATION_PATHS } from "@/lib/endpoints";
import type { Location, ModifyLocation, ProcessResponse } from "@/types";

export const locationApi = {
  list: () => api.get<Location[]>(LOCATION_PATHS.list).then((r) => r.data),

  retrieve: (id: number) =>
    api.get<Location>(`${LOCATION_PATHS.list}/${id}`).then((r) => r.data),

  create: (data: ModifyLocation) =>
    api.post<ProcessResponse>(LOCATION_PATHS.create, data).then((r) => r.data),

  activate: (id: number) =>
    api
      .post<ProcessResponse>(`${LOCATION_PATHS.list}/${id}/activate`)
      .then((r) => r.data),

  deactivate: (id: number) =>
    api
      .post<ProcessResponse>(`${LOCATION_PATHS.list}/${id}/deactivate`)
      .then((r) => r.data),

  update: (id: number, data: ModifyLocation) =>
    api
      .patch<ProcessResponse>(`${LOCATION_PATHS.create}/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) =>
    api
      .delete<ProcessResponse>(`${LOCATION_PATHS.create}/${id}`)
      .then((r) => r.data),
};
