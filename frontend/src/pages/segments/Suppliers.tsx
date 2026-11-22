import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Loading from "@/components/Loading";
import { supplierApi } from "@/services/Supplierapi";
import type { Supplier } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { isAxiosError } from "axios";
import { Plus, Check, X, EllipsisVertical, Search } from "lucide-react";
import { showError, showSuccess } from "@/services/toasts";
import { Can } from "@/components/permissions";

export default function Suppliers() {
  const navigate = useNavigate();
  const location = useLocation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const filtered = useMemo(
    () =>
      suppliers.filter((supplier) =>
        `${supplier.name} ${supplier.contact} ${supplier.notes}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [suppliers, query],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openAddSupplierForm = () => {
    navigate("/add/suppliers", {
      state: { background: location },
    });
  };

  const openEditSupplierForm = (id: number) => {
    navigate(`/edit/suppliers/${id}`, {
      state: { background: location },
    });
  };

  const fetchSuppliers = useCallback(async () => {
    const data = await supplierApi.list();
    setSuppliers(data);
  }, []);

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await fetchSuppliers();
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.error : undefined;
      setError(
        typeof message === "string" && message.trim()
          ? message
          : "Unable to load suppliers. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      loadSuppliers();
    }

    fetchData();
  }, [loadSuppliers, location]);

  const deactivateSupplier = useCallback(
    async (id: number) => {
      try {
        await supplierApi.deactivate(id);
        showSuccess("Supplier deactivated successfully !");
        fetchSuppliers();
      } catch {
        showError("Failed to deactivate supplier");
      }
    },
    [fetchSuppliers],
  );

  const activateSupplier = useCallback(
    async (id: number) => {
      try {
        await supplierApi.activate(id);
        showSuccess("Supplier activated successfully !");
        fetchSuppliers();
      } catch {
        showError("Failed to activate supplier");
      }
    },
    [fetchSuppliers],
  );

  return (
    <main className="min-h-screen bg-[#edf4f4] px-4 py-6 text-slate-800 sm:px-7 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Suppliers
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage vendors, contacts, and outlet availability
            </p>
          </div>
          <Can permission="suppliers:create">
            <button
              onClick={openAddSupplierForm}
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#216d75] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#195c63] focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
            >
              <Plus /> Add Supplier
            </button>
          </Can>
        </header>

        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
            <span className="text-[#216d75]" aria-hidden="true">
              ◉
            </span>{" "}
            {filtered.length} suppliers
          </span>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search suppliers</span>
            <span
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400"
              aria-hidden="true"
            >
              <Search size={16} />
            </span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search suppliers..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </label>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          {loading ? (
            <div
              className="flex min-h-64 items-center justify-center"
              role="status"
              aria-label="Loading suppliers"
            >
              <Loading />
            </div>
          ) : (
            <>
              {error ? (
                <div
                  className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center"
                  role="alert"
                >
                  <span
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-red-600"
                    aria-hidden="true"
                  >
                    !
                  </span>
                  <h2 className="text-base font-semibold text-slate-900">
                    Couldn’t load suppliers
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={loadSuppliers}
                    className="mt-5 rounded-lg bg-[#216d75] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#195c63] focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] table-fixed text-left lg:min-w-[1200px]">
                      <thead className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="w-[18%] px-5 py-4">Name</th>
                          <th className="w-[14%] px-3 py-4">Contact</th>
                          <th className="w-[24%] px-3 py-4">Notes</th>
                          <th className="w-[17%] px-3 py-4">
                            Available to outlet ?
                          </th>
                          <th className="w-[10%] px-3 py-4">Status</th>
                          <Can permission="suppliers:deactivate">
                            <th className="w-[12%] px-2 py-4"> </th>
                          </Can>
                          <Can permission="suppliers:edit">
                            <th className="w-[5%] px-2 py-4"> </th>
                          </Can>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visible.map((supplier) => (
                          <tr
                            key={supplier.id}
                            className="text-xs hover:bg-slate-50/70"
                          >
                            <td className="px-5 py-3">
                              <div className="truncate font-semibold text-slate-800">
                                {supplier.name}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="truncate font-medium text-slate-700">
                                {supplier.contact ? `${supplier.contact}` : "—"}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div
                                className="truncate text-slate-500"
                                title={supplier.notes ?? ""}
                              >
                                {supplier.notes ?? "------------"}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold items-center gap-2
                          ${supplier.outlet_allowed ? "bg-[#e2f1ef] text-[#377b77]" : "bg-slate-100 text-slate-500"}`}
                              >
                                {supplier.outlet_allowed ? (
                                  <>
                                    <Check size={16} /> Yes
                                  </>
                                ) : (
                                  <>
                                    <X size={16} /> No
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize
                          ${supplier.status === "active" ? "bg-[#e2f1ef] text-[#377b77]" : "bg-slate-100 text-slate-500"}`}
                              >
                                {supplier.status}
                              </span>
                            </td>
                            <Can permission="suppliers:deactivate">
                              <td className="px-2 py-3">
                                {supplier.status === "active" ? (
                                  <button
                                    onClick={() =>
                                      deactivateSupplier(supplier.id)
                                    }
                                    className="w-full rounded-md bg-slate-100 px-2 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      activateSupplier(supplier.id)
                                    }
                                    className="w-full rounded-md bg-slate-100 px-2 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                                  >
                                    Activate
                                  </button>
                                )}
                              </td>
                            </Can>
                            <Can permission="suppliers:edit">
                              <td className="px-2 py-3 text-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger
                                    render={
                                      <button
                                        aria-label={`More options for ${supplier.name}`}
                                        className="rounded p-1 text-slate-500 hover:bg-slate-100"
                                      >
                                        <EllipsisVertical size={20} />
                                      </button>
                                    }
                                  />
                                  <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          openEditSupplierForm(supplier.id)
                                        }
                                      >
                                        Edit
                                      </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </Can>
                          </tr>
                        ))}
                        {visible.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-5 py-12 text-center text-sm text-slate-500"
                            >
                              No suppliers found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <footer className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <p>
                      Showing{" "}
                      <span className="font-semibold text-slate-700">
                        {filtered.length ? (page - 1) * pageSize + 1 : 0}–
                        {Math.min(page * pageSize, filtered.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-slate-700">
                        {filtered.length}
                      </span>{" "}
                      suppliers
                    </p>
                    <nav
                      aria-label="Supplier pages"
                      className="flex items-center gap-1 self-end sm:self-auto"
                    >
                      <button
                        onClick={() =>
                          setPage((current) => Math.max(1, current - 1))
                        }
                        disabled={page === 1}
                        aria-label="Previous page"
                        className="h-8 w-8 rounded-md bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                      >
                        ‹
                      </button>
                      {Array.from(
                        { length: pageCount },
                        (_, index) => index + 1,
                      )
                        .slice(0, 5)
                        .map((pageNumber) => (
                          <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            aria-current={
                              page === pageNumber ? "page" : undefined
                            }
                            className={`h-8 min-w-8 rounded-md px-2 font-semibold ${page === pageNumber ? "bg-[#216d75] text-white" : "text-slate-600 hover:bg-slate-100"}`}
                          >
                            {pageNumber}
                          </button>
                        ))}
                      <button
                        onClick={() =>
                          setPage((current) => Math.min(pageCount, current + 1))
                        }
                        disabled={page === pageCount}
                        aria-label="Next page"
                        className="h-8 w-8 rounded-md bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                      >
                        ›
                      </button>
                    </nav>
                  </footer>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
