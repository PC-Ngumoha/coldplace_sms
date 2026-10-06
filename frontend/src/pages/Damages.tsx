import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type SpoilageRecord = {
  product: string;
  location: string;
  quantity: string;
  unit: string;
  date: string;
  reason: string;
};

const fieldClass = `h-11 w-full rounded-lg border border-lighter-teal-blue bg-white px-4 text-sm text-slate-900 
  outline-none transition focus:outline-none focus:border-teal-blue focus:ring-2 focus:ring-slate-900/15`;

export default function Damages() {
  const [location, setLocation] = useState("Central Area");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [date, setDate] = useState("2026-06-10");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [records, setRecords] = useState<SpoilageRecord[]>([]);

  function submitSpoilage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRecords((current) => [
      { product, location, quantity, unit, date, reason },
      ...current,
    ]);
    setProduct("");
    setQuantity("");
    setValue("");
    setReason("");
  }

  return (
    <main className="min-h-screen bg-lightest-teal-blue px-2 py-4 text-slate-900 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-4">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Damage &amp; loss
          </h1>
          <p className="mt-1 text-[12px] text-slate-400 md:text-base">
            Transit damage is logged at receiving; spoilage is recorded here and
            approved before it reduces stock
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-lighter-teal-blue bg-white">
          <div
            className="flex flex-col gap-4 border-b border-lighter-teal-blue px-5 py-4 sm:flex-row
          sm:items-center sm:justify-between sm:px-6"
          >
            <div>
              <h2 className="font-semibold">Record spoilage</h2>
              <p className="mt-0.5 text-[12px] md:text-base text-slate-400">
                Loss discovered after goods entered a location
              </p>
            </div>
            <label className="sr-only" htmlFor="damage-location">
              Location
            </label>
            <select
              id="damage-location"
              className={`${fieldClass} sm:w-[200px]`}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            >
              <option>Central Area</option>
              <option>North Store</option>
              <option>South Store</option>
            </select>
          </div>

          <form className="p-5 sm:px-6 sm:py-5" onSubmit={submitSpoilage}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
              <label className="block text-sm font-medium text-slate-500">
                Product
                <select
                  className={`${fieldClass} mt-1`}
                  value={product}
                  onChange={(event) => setProduct(event.target.value)}
                  required
                >
                  <option value="">Select…</option>
                  <option>Fresh produce</option>
                  <option>Dairy</option>
                  <option>Frozen goods</option>
                  <option>Meat</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-500">
                Quantity
                <input
                  className={`${fieldClass} mt-1`}
                  type="number"
                  min="0.01"
                  step="any"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-500">
                Unit
                <select
                  className={`${fieldClass} mt-1`}
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                >
                  <option>kg</option>
                  <option>units</option>
                  <option>boxes</option>
                  <option>litres</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-500">
                Date
                <input
                  className={`${fieldClass} mt-1`}
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-500">
                Estimated value (₦)
                <input
                  className={`${fieldClass} mt-1`}
                  type="number"
                  min="0"
                  step="any"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />
                <span className="mt-1 block text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>
            </div>

            <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-end">
              <label className="block w-full text-sm font-medium text-slate-500 sm:max-w-[380px]">
                Reason
                <input
                  className={`${fieldClass} mt-1`}
                  type="text"
                  placeholder="e.g. Freezer downtime overnight"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  required
                />
                <span className="mt-1 block text-xs font-normal text-slate-400">
                  Required
                </span>
              </label>
              <Button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg 
                bg-teal-blue p-5 font-semibold text-white transition hover:bg-darker-teal-blue 
                focus:outline-none focus:ring-2 focus:ring-teal-blue focus:ring-offset-2 sm:w-auto"
              >
                <Check size={18} />
                <span>Submit</span>
              </Button>
            </div>
          </form>
        </section>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-lightest-teal-blue bg-white">
            <div className="border-b border-lightest-teal-blue px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Transit damage</h2>
              <p className="mt-0.5 text-sm text-slate-400">
                Logged during receiving — never enters inventory
              </p>
            </div>
            <div
              className="grid grid-cols-[1fr_52px_1fr] border-b border-lightest-teal-blue px-3 py-2.5 text-xs 
            font-medium uppercase tracking-wide text-slate-400 sm:px-4"
            >
              <span>Product</span>
              <span>Qty</span>
              <span>Ref</span>
            </div>
            <div className="min-h-[88px] px-4 py-8 text-center text-sm text-slate-400">
              None recorded.
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-lighter-teal-blue bg-white">
            <div className="border-b border-lighter-teal-blue px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Spoilage history</h2>
            </div>
            <div
              className="grid grid-cols-3 border-b border-lighter-teal-blue px-3 py-2.5 text-xs
            font-medium uppercase tracking-wide text-slate-400 sm:px-4"
            >
              <span>Product</span>
              <span>Location</span>
              <span>Status</span>
            </div>
            {records.length === 0 ? (
              <div className="min-h-[112px] px-4 py-9 text-center text-sm text-slate-400">
                None recorded.
              </div>
            ) : (
              <ul className="divide-y divide-lightest-teal-blue">
                {records.map((record, index) => (
                  <li
                    key={`${record.product}-${record.date}-${index}`}
                    className="grid grid-cols-3 gap-2 px-3 py-3 text-sm sm:px-4"
                  >
                    <span className="min-w-0 break-words">
                      {record.product}
                      <small className="block text-xs text-slate-400">
                        {record.quantity} {record.unit} · {record.date}
                      </small>
                    </span>
                    <span className="break-words">{record.location}</span>
                    <span>
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800">
                        Pending approval
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
