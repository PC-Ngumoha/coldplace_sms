import { AlertCircle, Plus, X, UserPlus2 } from "lucide-react";
import { Link, useLocation } from "react-router";
import type { Received } from "@/types";
import { Button } from "@/components/ui/button";
import { receivedApi } from "@/services/Receivedapi";
import { useState, useEffect, useCallback } from "react";
import ReceivingForm from "@/components/forms/ReceivingForm";
import Loading from "@/components/Loading";
import { isAxiosError } from "axios";
import { Can } from "@/components/permissions";

export default function Received() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [received, setReceived] = useState<Received[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(received.length / pageSize);
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const paginatedReceived = received.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const toggleFormVisibility = () => setIsOpen((visible) => !visible);

  const closeReceivingForm = () => {
    setIsOpen(false);
  };

  const fetchReceived = useCallback(async () => {
    const allReceived = await receivedApi.list();
    setReceived(allReceived);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        await fetchReceived();
      } catch (err) {
        setError(
          isAxiosError(err)
            ? err.response?.data.error
            : "Operation failed. Please try again later !",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [fetchReceived]);

  return (
    <main className="min-h-screen px-2 py-4 text-slate-900">
      <div className="mx-auto w-full max-w-screen-2xl">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold leading-7">
              Receiving
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Bulk goods received at the Central Area
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Can permission="suppliers:create">
              <Link
                to="/add/suppliers"
                state={{ background: location }}
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 p-2 text-sm font-semibold
            text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2
            focus:ring-amber-600 focus:ring-offset-2 sm:w-auto"
              >
                <UserPlus2 size={18} />
                <span>Add Supplier</span>
              </Link>
            </Can>
            <Can permission="receipts:create">
              <Button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-blue p-5 text-sm font-semibold 
            text-white transition-colors hover:bg-darker-teal-blue focus:outline-none focus:ring-2 
            focus:ring-teal-blue focus:ring-offset-2 sm:w-auto"
                onClick={toggleFormVisibility}
              >
                {!isOpen ? (
                  <>
                    <Plus size={18} />
                    <span>New receiving</span>
                  </>
                ) : (
                  <>
                    <X size={18} />
                    <span>Cancel</span>
                  </>
                )}
              </Button>
            </Can>
          </div>
        </header>

        {/* Add receiving form. */}
        {isOpen && (
          <ReceivingForm
            onClose={closeReceivingForm}
            reloadList={fetchReceived}
          />
        )}

        {loading ? (
          <Loading />
        ) : (
          <>
            {error ? (
              <section
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-red-600"
                    size={20}
                  />
                  <div>
                    <h2 className="font-semibold">
                      Unable to load receiving history
                    </h2>
                    <p className="mt-1 text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </section>
            ) : (
              <section className="overflow-auto rounded-lg md:rounded-xl lg:rounded-2xl border border-lighter-teal-blue bg-white">
                <h2 className="border-b border-lighter-teal-blue px-3 py-6 text-base font-semibold">
                  Receiving history
                </h2>
                <div className="w-full overflow-x-auto">
                  <table className="min-w-[900px] border-collapse table-fixed text-left lg:min-w-[1200px]">
                    <thead className="table-header-group">
                      <tr
                        className="border-b border-lighter-teal-blue text-sm font-semibold uppercase 
                tracking-wide text-slate-400"
                      >
                        <th scope="col" className="px-3 py-3 sm:px-5">
                          Reference
                        </th>
                        <th scope="col" className="px-3 py-3 sm:px-5">
                          Date
                        </th>
                        <th scope="col" className="px-3 py-3 sm:px-5">
                          Supplier
                        </th>
                        <Can permission="receipts:list:all">
                          <th scope="col" className="px-3 py-3 sm:px-5">
                            Location
                          </th>
                        </Can>
                        <th scope="col" className="px-3 py-3 sm:px-5">
                          Delivery Ref
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-right sm:px-5"
                        >
                          Total Value
                        </th>
                        <th scope="col" className="px-3 py-3 sm:px-5">
                          Received By
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-lighter-teal-blue">
                      {received.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-12 text-center text-sm text-slate-500"
                          >
                            <p className="font-semibold text-slate-700">
                              No receiving history yet
                            </p>
                            <p className="mt-1">
                              New receiving records will appear here.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        paginatedReceived.map((row) => (
                          <tr
                            key={row.id}
                            className="px-4 py-2 table-row text-sm font-mono"
                          >
                            <td className="table-cell px-3 py-3 font-semibold">
                              <Link
                                to={`/received/details/${row.id}`}
                                state={{ background: location }}
                                className="text-teal-blue hover:text-darker-teal-blue hover:underline"
                              >
                                {row.reference}
                              </Link>
                            </td>
                            <td className="table-cell px-3 py-3">
                              {row.receipt_date}
                            </td>
                            <td className="table-cell px-3 py-3">
                              {row.supplier_name}
                            </td>
                            <Can permission="receipts:list:all">
                              <td className="table-cell px-3 py-3">
                                {row.location_name}
                              </td>
                            </Can>
                            <td className="table-cell px-3 py-3">
                              {row.delivery_ref ?? "--------"}
                            </td>
                            <td className="table-cell px-3 py-3 text-right">
                              NGN {row.total_value}
                            </td>
                            <td className="table-cell px-3 py-3 text-center">
                              {row.created_by_name}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {received.length > 0 && (
                  <footer
                    aria-label="Receiving history pagination"
                    className="flex items-center justify-between gap-3 border-t border-lighter-teal-blue px-3 py-4 text-sm"
                  >
                    <span className="text-slate-500">
                      Showing {(page - 1) * pageSize + 1}–
                      {Math.min(page * pageSize, received.length)} of{" "}
                      {received.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setCurrentPage(page - 1)}
                        aria-label="Previous page"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
                        aria-label="Next page"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed
                        disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  </footer>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
