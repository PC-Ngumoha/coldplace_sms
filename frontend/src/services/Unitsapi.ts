import { api } from "@/api/client";
import { UNIT_PATHS } from "@/lib/endpoints";
import type { Unit } from "@/types";

export const unitsApi = {
  list: () => api.get<Unit[]>(UNIT_PATHS.list()).then((r) => r.data),
};
