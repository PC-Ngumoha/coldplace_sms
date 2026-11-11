import { api } from "@/api/client";
import { LOG_PATHS } from "@/lib/endpoints";
import type { Log } from "@/types";

export const logsApi = {
  list: () => api.get<Log[]>(LOG_PATHS.list).then((r) => r.data),
};
