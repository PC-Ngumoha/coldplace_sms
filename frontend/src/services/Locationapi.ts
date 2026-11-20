import { api } from "@/api/client";
import { LOCATION_PATHS } from "@/lib/endpoints";
import type { Location, ModifyLocation, ProcessResponse } from "@/types";

export const locationApi = {
  list: () => api.get<Location[]>(LOCATION_PATHS.list()).then((r) => r.data),

  retrieve: (id: number) =>
    api.get<Location>(LOCATION_PATHS.retrieve(id)).then((r) => r.data),

  create: (data: ModifyLocation) =>
    api
      .post<ProcessResponse>(LOCATION_PATHS.create(), data)
      .then((r) => r.data),

  activate: (id: number) =>
    api.post<ProcessResponse>(LOCATION_PATHS.activate(id)).then((r) => r.data),

  deactivate: (id: number) =>
    api
      .post<ProcessResponse>(LOCATION_PATHS.deactivate(id))
      .then((r) => r.data),

  update: (id: number, data: ModifyLocation) =>
    api
      .patch<ProcessResponse>(LOCATION_PATHS.update(id), data)
      .then((r) => r.data),
};
