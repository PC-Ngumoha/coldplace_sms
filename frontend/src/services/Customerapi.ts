import { api } from "@/api/client";
import { CUSTOMERS_PATHS } from "@/lib/endpoints";
import type {
  Customer,
  CustomerDetails,
  CustomerSuggestion,
  ProcessResponse,
  UpdateCustomer,
} from "@/types";

export const customerApi = {
  list: () => api.get<Customer[]>(CUSTOMERS_PATHS.list()).then((r) => r.data),
  retrieve: (customerId: number) =>
    api
      .get<CustomerDetails>(CUSTOMERS_PATHS.retrieve(customerId))
      .then((r) => r.data),
  search: (q: string) =>
    api
      .get<CustomerSuggestion[]>(CUSTOMERS_PATHS.search(q))
      .then((r) => r.data),
  update: (customerId: number, data: UpdateCustomer) =>
    api
      .patch<ProcessResponse>(CUSTOMERS_PATHS.update(customerId), data)
      .then((r) => r.data),
  activate: (customerId: number) =>
    api
      .post<ProcessResponse>(CUSTOMERS_PATHS.activate(customerId))
      .then((r) => r.data),
  deactivate: (customerId: number) =>
    api
      .post<ProcessResponse>(CUSTOMERS_PATHS.deactivate(customerId))
      .then((r) => r.data),
};
