import { api } from "@/api/client";
import { LOCATION_PATHS } from "@/lib/endpoints";
import type { Location } from "@/types";

export const locationApi = {
  list: () => api.get<Location[]>(LOCATION_PATHS.list).then((r) => r.data),
};
