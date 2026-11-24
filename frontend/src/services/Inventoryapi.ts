import { api } from "@/api/client";
import { INVENTORY_PATHS } from "@/lib/endpoints";
import type { InventoryBalance, LedgerResponse } from "@/types";

export const inventoryApi = {
  balances: () =>
    api.get<InventoryBalance[]>(INVENTORY_PATHS.balances()).then((r) => r.data),
  ledger: (productId: number, locationId: number) =>
    api
      .get<LedgerResponse>(INVENTORY_PATHS.ledger(productId, locationId))
      .then((r) => r.data),
};
