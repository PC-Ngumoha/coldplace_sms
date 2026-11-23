import { api } from "@/api/client";
import { RECEIVED_PATHS } from "@/lib/endpoints";
import type {
  Received,
  ReceivedDetails,
  CreateReceived,
  ProcessResponse,
} from "@/types";

export const receivedApi = {
  list: () => api.get<Received[]>(RECEIVED_PATHS.list()).then((r) => r.data),

  retrieve: (id: number) =>
    api.get<ReceivedDetails>(RECEIVED_PATHS.retrieve(id)).then((r) => r.data),

  create: (data: CreateReceived) =>
    api
      .post<ProcessResponse>(RECEIVED_PATHS.create(), data)
      .then((r) => r.data),
};
