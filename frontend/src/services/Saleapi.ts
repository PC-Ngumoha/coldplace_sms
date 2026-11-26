import { api } from "@/api/client";
import { SALES_PATHS } from "@/lib/endpoints";
import type { Sale, SaleDetails, CreateSale, CreateSaleResult } from "@/types";

export const saleApi = {
  list: (from: string, to: string) =>
    api.get<Sale[]>(SALES_PATHS.list(from, to)).then((r) => r.data),
  retrieve: (saleId: number) =>
    api.get<SaleDetails>(SALES_PATHS.retrieve(saleId)).then((r) => r.data),
  create: (data: CreateSale) =>
    api.post<CreateSaleResult>(SALES_PATHS.create(), data).then((r) => r.data),
};
