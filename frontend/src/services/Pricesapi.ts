import { api } from "@/api/client";
import { PRICES_PATHS } from "@/lib/endpoints";
import type {
  ProductPrice,
  PriceHistoryItem,
  SetPrice,
  SetPriceResult,
} from "@/types";

export const pricesApi = {
  current: () =>
    api.get<ProductPrice[]>(PRICES_PATHS.current()).then((r) => r.data),
  history: (productId: number, unitId?: number) =>
    api
      .get<PriceHistoryItem[]>(PRICES_PATHS.history(productId, unitId))
      .then((r) => r.data),
  set: (data: SetPrice) =>
    api.post<SetPriceResult>(PRICES_PATHS.set(), data).then((r) => r.data),
};
