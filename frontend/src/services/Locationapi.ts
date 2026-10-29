import { api } from "@/api/client";
import { LOCATION_PATHS } from "@/lib/endpoints";
import type { Location } from "@/types";

export const locationApi = {
  list: () => api.get<Location[]>(LOCATION_PATHS.list).then((r) => r.data),
  activate: (id: number) =>
    api.post(`${LOCATION_PATHS.list}/${id}/activate`).then((r) => r.data),
  deactivate: (id: number) =>
    api.post(`${LOCATION_PATHS.list}/${id}/deactivate`).then((r) => r.data),
};
