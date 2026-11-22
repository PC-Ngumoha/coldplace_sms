import { api } from "@/api/client";
import { SUPPLIER_PATHS } from "@/lib/endpoints";
import type { Supplier, ModifySupplier, ProcessResponse } from "@/types";

export const supplierApi = {
  list: () => api.get<Supplier[]>(SUPPLIER_PATHS.list()).then((r) => r.data),

  retrieve: (id: number) =>
    api.get<Supplier>(SUPPLIER_PATHS.retrieve(id)).then((r) => r.data),

  create: (data: ModifySupplier) =>
    api
      .post<ProcessResponse>(SUPPLIER_PATHS.create(), data)
      .then((r) => r.data),

  activate: (id: number) =>
    api.post<ProcessResponse>(SUPPLIER_PATHS.activate(id)).then((r) => r.data),

  deactivate: (id: number) =>
    api
      .post<ProcessResponse>(SUPPLIER_PATHS.deactivate(id))
      .then((r) => r.data),

  update: (id: number, data: ModifySupplier) =>
    api
      .patch<ProcessResponse>(SUPPLIER_PATHS.update(id), data)
      .then((r) => r.data),
};
