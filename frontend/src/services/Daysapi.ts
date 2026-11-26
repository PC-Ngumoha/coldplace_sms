import { api } from "@/api/client";
import { DAY_PATHS } from "@/lib/endpoints";
import type {
  DayList,
  DayStatus,
  CloseDayRequest,
  ReopenDayRequest,
  DayActionResult,
} from "@/types";

export const daysApi = {
  status: (locationId: number, date: string) =>
    api.get<DayStatus>(DAY_PATHS.status(locationId, date)).then((r) => r.data),
  list: (from: string, to: string, locationId: number) =>
    api.get<DayList>(DAY_PATHS.list(from, to, locationId)).then((r) => r.data),
  close: (data: CloseDayRequest) =>
    api.post<DayActionResult>(DAY_PATHS.close(), data).then((r) => r.data),
  reopen: (data: ReopenDayRequest) =>
    api.post<DayActionResult>(DAY_PATHS.reopen(), data).then((r) => r.data),
};
