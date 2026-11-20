import { api } from "@/api/client";
import { CATEGORY_PATHS } from "@/lib/endpoints";
import type { Category, ModifyCategory, ProcessResponse } from "@/types";

export const categoryApi = {
  list: () => api.get<Category[]>(CATEGORY_PATHS.list()).then((r) => r.data),

  create: (data: ModifyCategory) =>
    api
      .post<ProcessResponse>(CATEGORY_PATHS.create(), data)
      .then((r) => r.data),

  activate: (id: number) =>
    api.post<ProcessResponse>(CATEGORY_PATHS.activate(id)).then((r) => r.data),

  deactivate: (id: number) =>
    api
      .post<ProcessResponse>(CATEGORY_PATHS.deactivate(id))
      .then((r) => r.data),

  update: (id: number, data: ModifyCategory) =>
    api
      .patch<ProcessResponse>(CATEGORY_PATHS.update(id), data)
      .then((r) => r.data),
};
