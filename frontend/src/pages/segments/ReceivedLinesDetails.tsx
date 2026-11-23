import { receivedApi } from "@/services/Receivedapi";
import Loading from "@/components/Loading";
import type { ReceivedDetails } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PackageOpen, X } from "lucide-react";
import { isAxiosError } from "axios";

export default function ReceivedLinesDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const receivedId = parseInt(id as string);
  const [receivedDetails, setReceivedDetails] = useState<ReceivedDetails>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const goBack = () => {
    navigate(-1);
  };

  const fetchReceivedDetails = useCallback(async () => {
    const record = await receivedApi.retrieve(receivedId);
    setReceivedDetails(record);
  }, [receivedId]);

  useEffect(() => {
    async function fetchData() {
      setError("");
      setLoading(true);
      try {
        await fetchReceivedDetails();
      } catch (err) {
        setError(
          isAxiosError(err)
            ? err.response?.data.error
            : "Operation failed. Please try again later",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [fetchReceivedDetails]);

  return (
    <div
      className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-black/50 p-2 sm:items-center sm:p-4"
      onClick={goBack}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="received-details-title"
        className="my-auto max-h-[calc(100dvh-1rem)] w-full overflow-y-auto rounded-lg bg-white p-4 
        shadow-[0_1rem_3rem_rgba(0,0,0,0.25)] sm:max-h-[calc(100dvh-2rem)] sm:p-6 lg:max-w-6xl"
        onClick={(evt) => {
          evt.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between">
          <h2 id="received-details-title">Details</h2>
          <button
            type="button"
            aria-label="Close details"
            className="text-2xl leading-none"
            onClick={(event) => {
              event.stopPropagation();
              goBack();
            }}
          >
            <X size={20} />
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            {error ? (
              <div
                role="alert"
                className="mt-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 font-semibold"
                >
                  !
                </span>
                <span>{error}</span>
              </div>
            ) : (
              <>
                {receivedDetails ? (
                  <>
                    {/* General details about the Receiving record */}
                    <section
                      aria-label="Receiving record details"
                      className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <dt className="text-gray-500">Reference</dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            {receivedDetails.reference}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Date</dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            {new Intl.DateTimeFormat("en-GB", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            }).format(new Date(receivedDetails.receipt_date))}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Supplier</dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            {receivedDetails.supplier_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Location</dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            {receivedDetails.location_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Delivery ref</dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            {receivedDetails.delivery_ref ?? "---------"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Received by</dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            {receivedDetails.created_by_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Time created</dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            {new Intl.DateTimeFormat("en-GB", {
                              timeZone: "Africa/Lagos",
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }).format(new Date(receivedDetails.created_at))}
                          </dd>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-4">
                          <dt className="text-gray-500">Notes</dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            {receivedDetails.notes ?? "----------"}
                          </dd>
                        </div>
                      </dl>
                    </section>
                    {/* Details about the lines in that receiving. */}
                    <div className="mt-6 overflow-x-auto">
                      <table className="w-full min-w-[700px] border-collapse text-left text-sm sm:min-w-[900px]">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-600">
                            <th scope="col" className="px-3 py-2 font-medium">
                              Product (SKU and name)
                            </th>
                            <th scope="col" className="px-3 py-2 font-medium">
                              Unit
                            </th>
                            <th scope="col" className="px-3 py-2 font-medium">
                              Delivered
                            </th>
                            <th scope="col" className="px-3 py-2 font-medium">
                              Damaged
                            </th>
                            <th scope="col" className="px-3 py-2 font-medium">
                              Accepted kg
                            </th>
                            <th scope="col" className="px-3 py-2 font-medium">
                              Damage reason
                            </th>
                            <th scope="col" className="px-3 py-2 font-medium">
                              Unit cost
                            </th>
                            <th scope="col" className="px-3 py-2 font-medium">
                              Line value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {receivedDetails.lines.map((line) => (
                            <tr
                              key={line.id}
                              className="border-b border-gray-100"
                            >
                              <td className="px-3 py-3">
                                {line.sku} · {line.product_name}
                              </td>
                              <td className="px-3 py-3">{line.unit_code}</td>
                              <td className="px-3 py-3">
                                {line.delivered_qty}
                              </td>
                              <td className="px-3 py-3">{line.damaged_qty}</td>
                              <td className="px-3 py-3">{line.accepted_kg}</td>
                              <td className="px-3 py-3">
                                {line.damage_reason ?? "------"}
                              </td>
                              <td className="px-3 py-3 tracking-wide">
                                ₦ {line.unit_cost}
                              </td>
                              <td className="px-3 py-3 tracking-wide">
                                ₦ {line.line_value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div
                    role="status"
                    className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center"
                  >
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-gray-200">
                      <PackageOpen size={24} aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-gray-900">
                      No receiving record found
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                      This record may have been removed or is no longer
                      available.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
