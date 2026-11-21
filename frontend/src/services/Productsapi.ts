import { api } from "@/api/client";
import { PRODUCT_PATHS } from "@/lib/endpoints";
import type {
  Product,
  CreateProduct,
  UpdateProduct,
  ProcessResponse,
} from "@/types";

export const productsApi = {
  list: () => api.get<Product[]>(PRODUCT_PATHS.list()).then((r) => r.data),

  retrieve: (id: number) =>
    api.get<Product>(PRODUCT_PATHS.retrieve(id)).then((r) => r.data),

  create: (data: CreateProduct) =>
    api.post(PRODUCT_PATHS.create(), data).then((r) => r.data),

  activate: (id: number) =>
    api.post<ProcessResponse>(PRODUCT_PATHS.activate(id)).then((r) => r.data),

  deactivate: (id: number) =>
    api.post<ProcessResponse>(PRODUCT_PATHS.deactivate(id)).then((r) => r.data),

  update: (id: number, data: UpdateProduct) =>
    api
      .patch<ProcessResponse>(PRODUCT_PATHS.update(id), data)
      .then((r) => r.data),
};
