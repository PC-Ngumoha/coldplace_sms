import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Search, X } from "lucide-react";
import type { InventoryBalance, LedgerResponse } from "@/types";
import { inventoryApi } from "@/services/Inventoryapi";
import { useAuth } from "@/contexts/auth_context";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { formatDecimal, getErrorMessage } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const PAGE_SIZE = 10;

function InventoryLedgerDrawer({
  balance,
  open,
  onOpenChange,
}: {
  balance: InventoryBalance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [ledger, setLedger] = useState<LedgerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !balance) return;
    let cancelled = false;
    async function fetchData(balance: InventoryBalance) {
      setLoading(true);
      setError("");
      setLedger(null);
      try {
        const result = await inventoryApi.ledger(
          balance.product_id,
          balance.location_id,
        );
        if (!cancelled) setLedger(result);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData(balance);

    return () => {
      cancelled = true;
    };
  }, [balance, open]);

  const movements = useMemo(
    () =>
      [...(ledger?.items ?? [])].sort((a, b) => {
        const byDate = b.movement_date.localeCompare(a.movement_date);
        return byDate || b.id - a.id;
      }),
    [ledger],
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="data-[swipe-axis=x]:w-full data-[swipe-axis=x]:sm:w-[min(42rem,90vw)]">
        <DrawerHeader className="border-b border-lighter-teal-blue p-5 text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DrawerTitle className="text-lg">
                {balance?.product_name}
              </DrawerTitle>
              <DrawerDescription className="mt-1">
                SKU {balance?.sku} · {balance?.location_name}
              </DrawerDescription>
              <p className="mt-3 text-sm font-medium text-slate-700">
                Current balance:{" "}
                {formatDecimal(
                  ledger?.balance_kg ?? balance?.balance_kg ?? "0",
                )}{" "}
                kg
                {" · "}
                {ledger?.balance_cartons == null &&
                balance?.balance_cartons == null
                  ? "—"
                  : formatDecimal(
                      ledger?.balance_cartons ??
                        balance?.balance_cartons ??
                        "0",
                    )}{" "}
                cartons
              </p>
            </div>
            <DrawerClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Close inventory ledger"
                  className="min-h-11 min-w-11 shrink-0"
                >
                  <X size={18} />
                </Button>
              }
            />
          </div>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Stock movements
          </h3>
          {loading ? (
            <Loading />
          ) : error ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
            >
              {error}
            </div>
          ) : movements.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
              No movements recorded.
            </p>
          ) : (
            <ol className="space-y-3">
              {movements.map((item) => {
                const positive = !item.quantity_kg.trim().startsWith("-");
                const amount = formatDecimal(item.quantity_kg);
                return (
                  <li
                    key={item.id}
                    className="rounded-xl border border-lighter-teal-blue bg-white p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <time className="text-sm text-slate-500">
                        {item.movement_date}
                      </time>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                        {item.movement_type.replaceAll("_", " ")}
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <span
                        className={`font-semibold tabular-nums ${positive ? "text-emerald-700" : "text-red-700"}`}
                      >
                        {positive ? "+" : ""}
                        {amount} kg
                      </span>
                      <span className="text-right text-sm text-slate-600">
                        Balance {formatDecimal(item.balance_after)} kg
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{item.created_by_name}</span>
                      <span>Ref: {item.source_id}</span>
                    </div>
                    {item.reason && (
                      <p className="mt-2 text-sm text-slate-600">
                        {item.reason}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default function Inventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<InventoryBalance | null>(null);
  const canChooseLocation = user?.role !== "central" && user?.role !== "outlet";

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await inventoryApi.balances();
      setInventory(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      await fetchInventory();
    }

    fetchData();
  }, [fetchInventory]);

  const locations = useMemo(() => {
    const unique = new Map<number, string>();
    inventory.forEach((row) => unique.set(row.location_id, row.location_name));
    return [...unique.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return inventory.filter((row) => {
      const matchesSearch =
        !query ||
        row.product_name.toLocaleLowerCase().includes(query) ||
        row.sku.toLocaleLowerCase().includes(query);
      const matchesLocation =
        locationFilter === "all" || String(row.location_id) === locationFilter;
      return matchesSearch && matchesLocation;
    });
  }, [inventory, locationFilter, search]);

  const totalPages = Math.ceil(filteredInventory.length / PAGE_SIZE);
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const paginatedInventory = filteredInventory.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <main className="min-h-screen px-2 py-4 text-slate-900 sm:px-4">
      <div className="mx-auto w-full max-w-screen-2xl">
        <header className="mb-5">
          <h1 className="text-xl font-semibold leading-7 md:text-2xl">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Current stock by product and location
          </p>
        </header>

        <section className="mb-4 flex flex-col gap-3 rounded-xl border border-lighter-teal-blue bg-white p-3 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search by product name or SKU</span>
            <Search
              aria-hidden="true"
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search product name or SKU"
              className="min-h-11 w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
            />
          </label>
          {canChooseLocation && (
            <label className="w-full sm:w-56">
              <span className="sr-only">Filter by location</span>
              <select
                value={locationFilter}
                onChange={(event) => {
                  setLocationFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
              >
                <option value="all">All locations</option>
                {locations.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </section>

        {loading ? (
          <Loading />
        ) : error ? (
          <section
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"
          >
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <AlertCircle
                aria-hidden="true"
                className="shrink-0 text-red-600"
                size={20}
              />
              <div className="flex-1">
                <h2 className="font-semibold">Unable to load inventory</h2>
                <p className="mt-1 text-sm text-red-800">{error}</p>
              </div>
              <Button
                type="button"
                onClick={fetchInventory}
                className="min-h-11 bg-teal-blue text-white hover:bg-darker-teal-blue"
              >
                Retry
              </Button>
            </div>
          </section>
        ) : (
          <section className="overflow-hidden rounded-xl border border-lighter-teal-blue bg-white">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-lighter-teal-blue text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th scope="col" className="px-4 py-3">
                      Product
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Location
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Balance (kg)
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Balance (cartons)
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Last movement
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lighter-teal-blue">
                  {inventory.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        No stock recorded yet
                      </td>
                    </tr>
                  ) : filteredInventory.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        No inventory matches your search or location filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedInventory.map((row) => (
                      <tr
                        key={`${row.product_id}-${row.location_id}`}
                        onClick={() => setSelected(row)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelected(row);
                          }
                        }}
                        tabIndex={0}
                        aria-label={`View ${row.product_name} inventory ledger at ${row.location_name}`}
                        className={`cursor-pointer text-sm transition-colors hover:bg-teal-50 focus:bg-teal-50 focus:outline-none 
                            ${selected?.product_id === row.product_id && selected.location_id === row.location_id ? "bg-teal-50" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">
                            {row.product_name}
                          </div>
                          <div className="mt-0.5 font-mono text-xs text-slate-500">
                            {row.sku}
                          </div>
                        </td>
                        <td className="px-4 py-3">{row.location_name}</td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums">
                          {formatDecimal(row.balance_kg)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums">
                          {row.balance_cartons === null
                            ? "—"
                            : formatDecimal(row.balance_cartons)}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.last_movement_at || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredInventory.length > 0 && (
              <footer
                aria-label="Inventory pagination"
                className="flex flex-col gap-3 border-t border-lighter-teal-blue px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-slate-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filteredInventory.length)} of{" "}
                  {filteredInventory.length}
                </span>
                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <Button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setCurrentPage(page - 1)}
                    className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <span className="whitespace-nowrap text-slate-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setCurrentPage(page + 1)}
                    className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </footer>
            )}
          </section>
        )}
      </div>
      <InventoryLedgerDrawer
        balance={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </main>
  );
}
