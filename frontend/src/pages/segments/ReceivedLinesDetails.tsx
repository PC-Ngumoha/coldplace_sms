import { useNavigate } from "react-router";
import { X } from "lucide-react";

export default function ReceivedLinesDetails() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="fixed inset-0 z-[20] flex items-center justify-center bg-black/50 p-4"
      onClick={goBack}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="received-details-title"
        className="w-full max-w-6xl rounded-lg bg-white p-6 shadow-[0_1rem_3rem_rgba(0,0,0,0.25)]"
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
        {/* General details about the Receiving record */}
        <section
          aria-label="Receiving record details"
          className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-gray-500">Reference</dt>
              <dd className="mt-1 font-medium text-gray-900">RCV-2024-001</dd>
            </div>
            <div>
              <dt className="text-gray-500">Date</dt>
              <dd className="mt-1 font-medium text-gray-900">Jun 12, 2024</dd>
            </div>
            <div>
              <dt className="text-gray-500">Supplier</dt>
              <dd className="mt-1 font-medium text-gray-900">
                Green Valley Produce
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Location</dt>
              <dd className="mt-1 font-medium text-gray-900">Main Warehouse</dd>
            </div>
            <div>
              <dt className="text-gray-500">Delivery ref</dt>
              <dd className="mt-1 font-medium text-gray-900">DEL-7842</dd>
            </div>
            <div>
              <dt className="text-gray-500">Received by</dt>
              <dd className="mt-1 font-medium text-gray-900">Alex Morgan</dd>
            </div>
            <div>
              <dt className="text-gray-500">Time created</dt>
              <dd className="mt-1 font-medium text-gray-900">
                Jun 12, 2024, 10:42 AM
              </dd>
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <dt className="text-gray-500">Notes</dt>
              <dd className="mt-1 font-medium text-gray-900">
                Delivery inspected on arrival.
              </dd>
            </div>
          </dl>
        </section>
        {/* Details about the lines in that receiving. */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
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
              <tr className="border-b border-gray-100">
                <td className="px-3 py-3">SKU-001 · Fresh Tomatoes</td>
                <td className="px-3 py-3">kg</td>
                <td className="px-3 py-3">50</td>
                <td className="px-3 py-3">2</td>
                <td className="px-3 py-3">48</td>
                <td className="px-3 py-3">Bruised</td>
                <td className="px-3 py-3">$2.50</td>
                <td className="px-3 py-3">$120.00</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-3 py-3">SKU-014 · Yellow Onions</td>
                <td className="px-3 py-3">kg</td>
                <td className="px-3 py-3">30</td>
                <td className="px-3 py-3">0</td>
                <td className="px-3 py-3">30</td>
                <td className="px-3 py-3">—</td>
                <td className="px-3 py-3">$1.80</td>
                <td className="px-3 py-3">$54.00</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-3 py-3">SKU-027 · Green Bell Peppers</td>
                <td className="px-3 py-3">kg</td>
                <td className="px-3 py-3">20</td>
                <td className="px-3 py-3">1</td>
                <td className="px-3 py-3">19</td>
                <td className="px-3 py-3">Soft spots</td>
                <td className="px-3 py-3">$3.20</td>
                <td className="px-3 py-3">$60.80</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
