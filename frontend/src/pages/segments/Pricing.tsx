import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Can } from "@/components/permissions";
import { usePermissions } from "@/hooks/use_permissions";
import { getErrorMessage } from "@/lib/utils";
import { pricesApi } from "@/services/Pricesapi";
import { showError, showSuccess } from "@/services/toasts";
import type { PriceHistoryItem, ProductPrice, SetPrice } from "@/types";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  History,
  Search,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;
const SET_PRICE = "prices:set";
const VIEW_HISTORY = "prices:history";

function formatMoney(value: string | null | undefined): string {
  if (value == null) return "Not set";
  const match = value.trim().match(/^(\d+)(?:\.(\d*))?$/);
  if (!match) return `₦${value}`;

  const whole = match[1];
  const fraction = match[2] ?? "";

  const totalInKobo =
    BigInt(`${whole}${fraction.padEnd(2, "0").slice(0, 2)}` || "0") +
    (fraction.length > 2 && fraction[2] >= "5" ? 1n : 0n);

  const naira = (totalInKobo / 100n).toString();
  const kobo = (totalInKobo % 100n).toString().padStart(2, "0");

  return `₦${naira.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${kobo}`;
}

function toKobo(value: string): bigint {
  const [whole, fraction = ""] = value.split(".");
  const kobo = BigInt(`${whole}${fraction.padEnd(2, "0").slice(0, 2)}`);
  return kobo + (fraction.length > 2 && fraction[2] >= "5" ? 1n : 0n);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function priceChange(olderPrice: string, newerPrice: string) {
  const older = toKobo(olderPrice);
  const newer = toKobo(newerPrice);
  const difference = newer - older;
  if (difference === 0n || older === 0n) return null;
  const absolute = difference < 0n ? -difference : difference;
  const tenths = (absolute * 1000n + older / 2n) / older;
  const percentage = `${tenths / 10n}.${tenths % 10n}%`;
  const amount = `${difference > 0n ? "+" : "−"}${formatMoney((absolute / 100n).toString() + "." + (absolute % 100n).toString().padStart(2, "0")).slice(1)}`;
  return {
    label: `${amount} (${difference > 0n ? "+" : "−"}${percentage})`,
    increased: difference > 0n,
  };
}

function PriceHistoryDrawer({
  product,
  open,
  onOpenChange,
}: {
  product: ProductPrice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [unitFilter, setUnitFilter] = useState("all");
  const [history, setHistory] = useState<PriceHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!open || !product) return;
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError("");
      let items;

      try {
        if (unitFilter === "all") {
          items = await pricesApi.history(product!.product_id);
        } else {
          items = await pricesApi.history(
            product!.product_id,
            Number(unitFilter),
          );
        }
        if (!cancelled) setHistory(items);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [open, product, unitFilter, retry]);

  useEffect(() => {
    function selectAllUnits() {
      if (open) setUnitFilter("all");
    }

    selectAllUnits();
  }, [open, product?.product_id]);

  const groupedHistory = useMemo(() => {
    if (!product) return [];
    return product.units
      .map((unit) => ({
        unit,
        entries: history
          .filter((entry) => entry.unit_id === unit.unit_id)
          .sort((a, b) => b.effective_from.localeCompare(a.effective_from)),
      }))
      .filter((group) => group.entries.length > 0);
  }, [history, product]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="w-full bg-white sm:w-[480px]">
        <DrawerHeader className="border-b border-lighter-teal-blue px-5 py-5 pr-16 text-left">
          <DrawerTitle className="text-xl font-semibold text-slate-900">
            {product?.product_name ?? "Price history"}
          </DrawerTitle>
          <DrawerDescription className="text-slate-500">
            SKU: {product?.sku ?? "—"}
          </DrawerDescription>
          <DrawerClose
            aria-label="Close history"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center 
            justify-center rounded-lg border border-lighter-teal-blue text-slate-600 hover:bg-slate-50"
          >
            <X size={18} />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
          <div
            className="mb-5 flex flex-wrap gap-2"
            aria-label="Filter history by unit"
          >
            <button
              type="button"
              onClick={() => setUnitFilter("all")}
              className={`min-h-11 rounded-lg border px-4 text-sm font-medium 
                ${
                  unitFilter === "all"
                    ? "border-teal-blue bg-teal-blue text-white"
                    : "border-lighter-teal-blue text-slate-600 hover:bg-slate-50"
                }`}
            >
              All units
            </button>
            {product?.units.map((unit) => (
              <button
                key={unit.unit_id}
                type="button"
                onClick={() => setUnitFilter(String(unit.unit_id))}
                className={`min-h-11 rounded-lg border px-4 text-sm font-medium 
                  ${
                    unitFilter === String(unit.unit_id)
                      ? "border-teal-blue bg-teal-blue text-white"
                      : "border-lighter-teal-blue text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {unit.unit_code}
              </button>
            ))}
          </div>

          {loading ? (
            <Loading />
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <Button
                type="button"
                onClick={() => setRetry((value) => value + 1)}
                className="min-h-11 rounded-lg bg-teal-blue px-5 text-white hover:bg-darker-teal-blue"
              >
                Retry
              </Button>
            </div>
          ) : history.length === 0 ? (
            <div className="flex min-h-[120px] items-center justify-center text-sm text-slate-400">
              No price history yet
            </div>
          ) : (
            <div className="space-y-6">
              {groupedHistory.map(({ unit, entries }) => (
                <section key={unit.unit_id}>
                  {unitFilter === "all" && (
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {unit.unit_code}
                    </h3>
                  )}
                  <ol className="space-y-0">
                    {entries.map((entry, index) => {
                      const change =
                        entry.effective_to === null || index === 0
                          ? null
                          : priceChange(entry.price, entries[index - 1].price);
                      return (
                        <li
                          key={entry.id}
                          className="relative border-l-2 border-lighter-teal-blue pb-6 pl-5 last:pb-0"
                        >
                          <span
                            className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-white ${entry.effective_to === null ? "bg-teal-blue" : "bg-slate-300"}`}
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-lg font-semibold text-slate-900">
                              {formatMoney(entry.price)}
                            </span>
                            <span className="text-sm text-slate-500">
                              / {entry.unit_code}
                            </span>
                            {entry.effective_to === null && (
                              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-slate-600">
                            {formatDate(entry.effective_from)} –{" "}
                            {entry.effective_to === null
                              ? "Current"
                              : formatDate(entry.effective_to)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Set by {entry.set_by_name || "—"}
                          </p>
                          {change && (
                            <p
                              className={`mt-1 text-xs font-medium ${change.increased ? "text-green-700" : "text-red-600"}`}
                            >
                              {change.label}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default function Pricing() {
  const { can } = usePermissions();
  // const canSetPrice = can(SET_PRICE);
  const canViewHistory = can(VIEW_HISTORY);

  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);
  const [historyProduct, setHistoryProduct] = useState<ProductPrice | null>(
    null,
  );

  const clearFields = () => {
    setSelectedProductId("");
    setSelectedUnitId("");
    setPriceValue("");
  };

  async function loadPrices() {
    setLoading(true);
    setLoadError("");
    try {
      setPrices(await pricesApi.current());
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await loadPrices();
    }

    fetchData();
  }, []);

  const selectedProduct = prices.find(
    (product) => String(product.product_id) === selectedProductId,
  );
  const units = selectedProduct?.units ?? [];
  const filteredPrices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return prices
      .filter(
        (product) =>
          !query ||
          product.product_name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query),
      )
      .sort(
        (a, b) =>
          (sortAscending ? 1 : -1) *
          a.product_name.localeCompare(b.product_name),
      );
  }, [prices, search, sortAscending]);
  const pageCount = Math.max(1, Math.ceil(filteredPrices.length / PAGE_SIZE));
  const visiblePrices = filteredPrices.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );

  function openHistory(product: ProductPrice) {
    if (!canViewHistory) return;
    setHistoryProduct(product);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!selectedProductId || !selectedUnitId) {
      setFormError("Choose a product and unit.");
      return;
    }
    if (
      !/^\d{1,10}(\.\d{1,2})?$/.test(priceValue) ||
      toKobo(priceValue) <= 0n
    ) {
      setFormError(
        "Enter a price greater than zero with up to 2 decimal places.",
      );
      return;
    }

    setSaving(true);
    try {
      const payload: SetPrice = {
        product_id: Number(selectedProductId),
        unit_id: Number(selectedUnitId),
        price: priceValue,
      };
      const result = await pricesApi.set(payload);
      clearFields();
      await loadPrices();
      const message =
        result.status === "created"
          ? "Price created"
          : result.status === "changed"
            ? "Price updated"
            : "No change, price already set";
      showSuccess(message);
      setFormError("");
    } catch (error) {
      const message = getErrorMessage(error);
      setFormError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold leading-7">Pricing</h1>
          <p className="mt-1 text-sm text-slate-400">
            One selling price per product, set for all available locations.
          </p>
        </header>

        {/* Set Price Card */}
        <Can permission={SET_PRICE}>
          <section className="mb-5 overflow-hidden rounded-2xl border border-lighter-teal-blue bg-white">
            <div className="border-b border-lighter-teal-blue px-5 py-4">
              <h2 className="font-semibold">Set a price</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                This price will apply at all locations
              </p>
            </div>

            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
            >
              <label className="block text-sm font-medium text-slate-600">
                <span className="mb-1 block">Product</span>
                <select
                  value={selectedProductId}
                  onChange={(event) => {
                    setSelectedProductId(event.target.value);
                    setSelectedUnitId("");
                    setFormError("");
                  }}
                  className="h-11 w-full rounded-lg border border-lighter-teal-blue bg-white px-4 text-base
                font-normal text-slate-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {prices.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.product_name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-600">
                <span className="mb-1 block">Unit</span>
                <select
                  value={selectedUnitId}
                  onChange={(event) => setSelectedUnitId(event.target.value)}
                  className="h-11 w-full rounded-lg border border-lighter-teal-blue bg-white px-4 text-base font-normal
                text-slate-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                >
                  <option value="" disabled>
                    {selectedProduct ? "Select…" : "Choose product first"}
                  </option>
                  {units.map((unit) => (
                    <option key={unit.unit_id} value={unit.unit_id}>
                      {unit.unit_code}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-600">
                <span className="mb-1 block">Selling price (₦)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceValue}
                  onChange={(event) => setPriceValue(event.target.value)}
                  className="h-11 w-full rounded-lg border border-lighter-teal-blue bg-white px-4 text-base
                font-normal text-slate-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                />
              </label>
              <Button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-blue px-5 font-semibold
              text-white transition hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue
              focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 lg:col-span-1"
              >
                <Check size={18} />
                <span>{saving ? "Saving…" : "Save price"}</span>
              </Button>
              {formError && (
                <p
                  role="alert"
                  className="text-sm text-red-600 sm:col-span-2 lg:col-span-4"
                >
                  {formError}
                </p>
              )}
            </form>
          </section>
        </Can>

        {/* Current Prices Section */}
        <section className="overflow-hidden rounded-2xl border border-lighter-teal-blue bg-white">
          <div className="border-b border-lighter-teal-blue px-5 py-4">
            <h2 className="font-semibold">Current prices</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Applies to all three locations
            </p>
          </div>
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <label className="relative block w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(0);
                }}
                placeholder="Search product or SKU"
                aria-label="Search product or SKU"
                className="h-11 w-full rounded-lg border border-lighter-teal-blue bg-white pl-10 pr-4 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
              />
            </label>
            <span className="text-sm text-slate-500">
              {filteredPrices.length} products
            </span>
          </div>
          <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(100px,0.8fr)_minmax(100px,0.8fr)_minmax(130px,1fr)_auto] items-center gap-3 border-y border-lighter-teal-blue px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-400 md:grid">
            <button
              type="button"
              onClick={() => setSortAscending((value) => !value)}
              className="min-h-11 text-left uppercase tracking-wide hover:text-slate-700"
            >
              Product {sortAscending ? "↑" : "↓"}
            </button>
            <span className="text-center">Price / kg</span>
            <span className="text-center">Price / carton</span>
            <span>Updated</span>
            {canViewHistory && <span className="text-right">History</span>}
          </div>
          {loading ? (
            <Loading />
          ) : loadError ? (
            <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 px-4 py-6 text-sm text-red-600">
              <p>{loadError}</p>
              <Button
                type="button"
                onClick={() => void loadPrices()}
                className="min-h-11 rounded-lg bg-teal-blue px-5 text-white hover:bg-darker-teal-blue"
              >
                Retry
              </Button>
            </div>
          ) : filteredPrices.length === 0 ? (
            <div className="flex min-h-[88px] items-center justify-center px-4 py-6 text-sm text-slate-400">
              {search ? "No matching products." : "No prices set yet."}
            </div>
          ) : (
            <div>
              {visiblePrices.map((product) => {
                const kg = product.units.find(
                  (unit) => unit.unit_code === "kg",
                );
                const carton = product.units.find(
                  (unit) => unit.unit_code === "carton",
                );
                return (
                  <div
                    key={product.product_id}
                    onClick={() => openHistory(product)}
                    onKeyDown={(event) => {
                      if (
                        canViewHistory &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        openHistory(product);
                      }
                    }}
                    role={canViewHistory ? "button" : undefined}
                    tabIndex={canViewHistory ? 0 : undefined}
                    className={`grid grid-cols-2 gap-x-4 gap-y-3 border-b 
                      border-lighter-teal-blue px-4 py-4 last:border-b-0 
                      md:grid-cols-[minmax(0,1.5fr)_minmax(100px,0.8fr)_minmax(100px,0.8fr)_minmax(130px,1fr)_auto]
                      md:items-center md:gap-3 md:px-5 ${
                        canViewHistory
                          ? "cursor-pointer hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-700/30"
                          : ""
                      }`}
                  >
                    <div className="col-span-2 min-w-0 md:col-span-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {product.product_name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {product.sku}
                      </p>
                    </div>
                    <div className="text-sm md:text-center">
                      <span className="mb-1 block text-xs text-slate-400 md:hidden">
                        Price / kg
                      </span>
                      {formatMoney(kg?.price)}
                    </div>
                    <div className="text-sm md:text-center">
                      <span className="mb-1 block text-xs text-slate-400 md:hidden">
                        Price / carton
                      </span>
                      {!carton ? (
                        <span className="text-slate-400">—</span>
                      ) : carton.price !== null ? (
                        formatMoney(carton.price)
                      ) : carton.derived_price !== null ? (
                        <span className="text-slate-400">
                          {formatMoney(carton.derived_price)}{" "}
                          <span className="block text-xs">≈ from kg price</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Not set</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="mb-1 block text-xs text-slate-400 md:hidden">
                        Updated
                      </span>
                      {kg?.effective_from ? (
                        <>
                          <span>{formatDate(kg.effective_from)}</span>
                          <span className="block text-xs text-slate-400">
                            {kg.set_by_name || "—"}
                          </span>
                        </>
                      ) : (
                        "—"
                      )}
                    </div>
                    <Can permission={VIEW_HISTORY}>
                      <div className="col-span-2 md:col-span-1 md:text-right">
                        <Button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openHistory(product);
                          }}
                          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border 
                          border-lighter-teal-blue bg-white px-3 font-medium text-teal-800 hover:bg-teal-50 md:w-auto"
                        >
                          <History size={16} />
                          History
                        </Button>
                      </div>
                    </Can>
                  </div>
                );
              })}
            </div>
          )}
          {!loading && !loadError && filteredPrices.length > PAGE_SIZE && (
            <div className="flex items-center justify-between gap-3 border-t border-lighter-teal-blue px-4 py-3 sm:px-5">
              <span className="text-sm text-slate-500">
                Page {page + 1} of {pageCount}
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((value) => value - 1)}
                  aria-label="Previous page"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-lighter-teal-blue 
                  bg-white text-slate-700 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </Button>
                <Button
                  type="button"
                  disabled={page + 1 >= pageCount}
                  onClick={() => setPage((value) => value + 1)}
                  aria-label="Next page"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-lighter-teal-blue 
                  bg-white text-slate-700 disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
      <PriceHistoryDrawer
        product={historyProduct}
        open={historyProduct !== null}
        onOpenChange={(open) => {
          if (!open) setHistoryProduct(null);
        }}
      />
    </main>
  );
}
