import type { Log, User } from "@/types";
import { logsApi } from "@/services/Logsapi";
import { userApi } from "@/services/Userapi";
import { parseUserAgent } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { clsx } from "cn";

const badge =
  "rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600";

export default function AuditLogs() {
  const LOGS_PER_PAGE = 10;
  const [logs, setLogs] = useState<Log[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedLog, setSelectedLog] = useState<number>();
  const [page, setPage] = useState(0);
  const start = page * LOGS_PER_PAGE;
  const end = page * LOGS_PER_PAGE + LOGS_PER_PAGE;
  const pages = Math.ceil(logs.length / LOGS_PER_PAGE);

  useEffect(() => {
    async function fetchData() {
      const logs = await logsApi.list();
      const users = await userApi.list();
      setLogs(logs);
      setUsers(users);
    }

    fetchData();
  }, []);

  const toggleLog = (id: number) => {
    setSelectedLog((prev) => (prev !== id ? id : undefined));
  };

  const nextPage = () => {
    if (page < pages) {
      setPage((page) => page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage((page) => page - 1);
    }
  };

  return (
    <main className=" bg-[#f3f6f7] px-3 py-5 text-slate-800">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Audit log
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Every recorded action across all locations · newest first · times
              in WAT
            </p>
          </div>
        </header>

        <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
          {/* DESKTOP & TABLET */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-325 table-fixed border-collapse text-left">
              <thead className="text-[11px] uppercase tracking-wide text-slate-400">
                <tr className="border-b border-slate-100">
                  <th className="px-3 py-3 font-medium">Time</th>
                  <th className="px-3 py-3 font-medium">User</th>
                  <th className="px-3 py-3 font-medium">Action &amp; reason</th>
                  <th className="px-3 py-3 font-medium">Entity</th>
                  <th className="px-3 py-3 font-medium">ID</th>
                  <th className="px-3 py-3 font-medium">Old value</th>
                  <th className="px-3 py-3 font-medium">New value</th>
                  <th className="px-3 py-3 font-medium">IP address</th>
                  <th className="px-3 py-3 font-medium">User agent</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(start, end).map((row) => (
                  <AuditRow
                    key={row.id}
                    row={row}
                    users={users}
                    selected={selectedLog}
                    onSelect={toggleLog}
                    badge={badge}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW */}
          <div className="divide-y divide-slate-100 md:hidden">
            {logs.slice(start, end).map((row) => (
              <MobileRow
                key={row.id}
                row={row}
                users={users}
                badge={badge}
                selected={selectedLog}
                onSelect={toggleLog}
              />
            ))}
          </div>
          <footer
            className="flex flex-col gap-2 border-t border-slate-100 px-3 py-3 text-[10px] text-slate-400
            sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              Showing {logs.slice(start, end).length} of {logs.length} events
            </span>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                className="rounded border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50"
                onClick={prevPage}
              >
                <ChevronLeft size={12} />
              </button>
              <span>
                Page <b className="font-medium text-slate-600">{page + 1}</b> of{" "}
                {pages}
              </span>
              <button
                className="rounded border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50"
                onClick={nextPage}
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}

function AuditRow({
  row,
  badge,
  users,
  selected,
  onSelect,
}: {
  row: Log;
  badge: string;
  users: User[];
  selected: number | undefined;
  onSelect: (id: number) => void;
}) {
  const user = users.find((user) => user.id === row.user_id);
  const oldValues = row.old_value !== null ? JSON.parse(row.old_value) : null;
  const oldKeyCount = oldValues ? Object.keys(oldValues).length : "NULL";
  const newValues = row.new_value !== null ? JSON.parse(row.new_value) : null;
  const newKeyCount = newValues ? Object.keys(newValues).length : "NULL";
  const { os, browser } = parseUserAgent(row.user_agent);

  return (
    <>
      <tr
        className={`${row.id === selected ? "bg-slate-100/90" : "bg-white"} text-[12px]`}
        onClick={() => onSelect(row.id)}
      >
        <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-600">
          {row.created_at}
        </td>
        <td className="px-3 py-3">
          {row.user_id && (
            <div className="flex items-center gap-2">
              <img
                className="grid h-5 w-5 shrink-0 rounded-full bg-slate-100"
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
              />
              <div className="whitespace-nowrap">
                <div className="font-medium text-slate-700">
                  {user?.name ?? "User name"}
                </div>
                <div className="text-[9px] text-slate-400">
                  {user?.role ?? "User role"}
                </div>
              </div>
            </div>
          )}
        </td>
        <td className="min-w-[220px] px-3 py-3">
          <div className="font-medium text-slate-700">• {row.action}</div>
          <div className="mt-0.5 text-[9px] text-slate-400">{row.reason}</div>
        </td>
        <td className="px-3 py-3">
          <span className={badge}>{row.entity}</span>
        </td>
        <td className="px-3 py-3 font-medium">{row.id}</td>
        <td className="px-2 py-3">
          <Value value={oldKeyCount as string} />
        </td>
        <td className="px-2 py-3">
          <Value value={newKeyCount as string} />
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-slate-500">
          {row.ip_address}
        </td>
        <td className="px-3 py-3">
          <div className="text-slate-600">
            ◉ {browser} ( {os} )
          </div>
        </td>
      </tr>
      {row.id === selected && (
        <tr className="bg-slate-100/90 py-4">
          <td colSpan={9} className="px-3 pb-3 pt-0">
            <div className="grid gap-2  lg:grid-cols-2">
              <JsonPanel title="OLD" value={oldValues} />
              <JsonPanel title="NEW" value={newValues} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Value({ value }: { value: string }) {
  return value === "NULL" ? (
    <span className="rounded border border-slate-200 bg-white px-1.5 py-1 text-[9px] text-slate-400">
      NULL
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[9px] text-slate-600">
      {value} <span className="text-slate-400">⌄</span>
    </span>
  );
}

function JsonPanel({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex justify-between border-b border-slate-100 px-2.5 py-1.5 text-[10px] font-medium text-slate-400">
        <span>{title}</span>
      </div>
      <pre className="overflow-x-auto px-2.5 py-2 text-[10px] leading-4 text-slate-600">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

function MobileRow({
  row,
  badge,
  users,
  selected,
  onSelect,
}: {
  row: Log;
  badge: string;
  users: User[];
  selected: number | undefined;
  onSelect: (id: number) => void;
}) {
  const user = users.find((user) => user.id === row.user_id);
  const oldValues = row.old_value !== null ? JSON.parse(row.old_value) : null;
  const oldKeyCount = oldValues ? Object.keys(oldValues).length : "NULL";
  const newValues = row.new_value !== null ? JSON.parse(row.new_value) : null;
  const newKeyCount = newValues ? Object.keys(newValues).length : "NULL";
  const { os, browser } = parseUserAgent(row.user_agent);

  return (
    <article className={clsx("p-3", row.id === selected && "bg-slate-100/90")}>
      <div
        className="flex items-start justify-between gap-3"
        onClick={() => onSelect(row.id)}
      >
        <div className="flex min-w-0 items-center gap-2">
          {row.user_id && (
            <img
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-500"
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-700">
              {user?.name ?? "Unknown User"}
            </p>
            <p className="text-[10px] text-slate-400">{user?.role}</p>
          </div>
        </div>
        <time className="shrink-0 text-[10px] text-slate-500">
          {row.created_at}
        </time>
      </div>
      <div className="mt-2 pl-9">
        <p className="text-[11px] font-medium text-slate-700">• {row.action}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">{row.reason}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={badge}>{row.entity}</span>
          <span className="text-[10px] text-slate-500">ID {row.id}</span>
          <Value value={oldKeyCount as string} />
          <span className="text-slate-300">→</span>
          <Value value={newKeyCount as string} />
        </div>
        <p className="mt-2 text-[9px] text-slate-400">
          {row.ip_address} · {browser} . {os}
        </p>
      </div>
      {row.id === selected && (
        <div className="mt-3 grid gap-2">
          {" "}
          <JsonPanel title="OLD" value={oldValues} />
          <JsonPanel title="NEW" value={newValues} />
        </div>
      )}
    </article>
  );
}
