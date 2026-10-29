import { api } from "@/api/client";
import { USER_PATHS } from "@/lib/endpoints";
import type { User } from "@/types";

export const userApi = {
  list: () => api.get<User[]>(USER_PATHS.list).then((r) => r.data),
};
