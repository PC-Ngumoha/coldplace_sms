import { Button } from "@/components/ui/button";
import { Plus, FileChartColumnIncreasing, X, Check } from "lucide-react";
import { useState } from "react";

export default function Sales() {
  const businessDate = "2026-10-06";
  const [isOpen, setIsOpen] = useState(false);
  const [saleItems, setSaleItems] = useState([
    { product: "", quantity: "", unit: "kg", price: "" },
  ]);

  const updateSaleItem = (
    index: number,
    field: "product" | "quantity" | "unit" | "price",
    value: string,
  ) => {
    setSaleItems((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const saleTotal = saleItems.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0,
  );

  return (
    <main className="min-h-screen px-2 py-5 text-slate-900 lg:px-5">
      <div className="mx-auto w-full max-w-[1500px]">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="md:w-1/3">
            <h1 className="text-2xl font-semibold leading-7">Sales</h1>
            <p className="mt-1 text-sm text-slate-400">
              Record sales as they happen, then generate a report for any period
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl 
              bg-teal-blue px-5 text-sm font-semibold text-white transition 
              hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue focus:ring-offset-2"
              onClick={() => setIsOpen(true)}
            >
              <Plus size={18} />
              <span>Create a sale</span>
            </Button>
            <Button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl 
              bg-amber-600 px-5 text-sm font-semibold text-white transition 
              hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
            >
              <FileChartColumnIncreasing size={18} />
              <span>Generate report</span>
            </Button>
          </div>
        </header>

        <section
          aria-label="Sales filters"
          className="mb-5 flex flex-col gap-4 rounded-2xl border border-lightest-teal-blue bg-white p-5 sm:flex-row sm:items-end"
        >
          <label className="flex w-full flex-col gap-1.5 text-sm font-medium text-slate-500 sm:w-44">
            Location
            <select
              className="h-11 w-full rounded-lg border border-lightest-teal-blue bg-white px-4 text-base
            font-normal text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-slate-900/15"
            >
              {/* TODO: Dynamically load locations from the database. */}
              <option>Central Area</option>
            </select>
          </label>
          <label className="flex w-full flex-col gap-1.5 text-sm font-medium text-slate-500 sm:w-44">
            Business date
            <input
              type="date"
              defaultValue={businessDate}
              className="h-11 w-full rounded-lg border border-lightest-teal-blue bg-white px-3 text-base font-normal 
              text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-slate-900/15"
            />
          </label>
          <div className="flex sm:ml-auto">
            <span
              className="inline-flex h-7 items-center rounded-full border border-amber-200 bg-amber-100 px-3
            text-sm text-amber-700"
            >
              Day open
            </span>
          </div>
        </section>

        {/* Add Sale Form. */}
        {isOpen && (
          <form
            className="mb-5 overflow-hidden rounded-2xl border border-teal-blue bg-white"
            onSubmit={(event) => {
              event.preventDefault();
              setIsOpen(false);
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">Create a sale</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Central Area · {businessDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-blue"
              >
                <X size={16} aria-hidden="true" />
                <span>Close</span>
              </button>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              {saleItems.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 rounded-xl bg-[#eef3f3] p-3 sm:grid-cols-2 
                  lg:grid-cols-[minmax(180px,1.35fr)_minmax(140px,1fr)_minmax(100px,.6fr)_minmax(160px,1fr)_32px] 
                  lg:items-center"
                >
                  <label className="flex flex-col gap-1.5 text-sm text-slate-600">
                    Product
                    <select
                      value={item.product}
                      onChange={(event) =>
                        updateSaleItem(index, "product", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-base 
                      text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                    >
                      <option value="">Select fish, chicken, etc…</option>
                      <option value="Fish">Fish</option>
                      <option value="Chicken">Chicken</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm text-slate-600">
                    Quantity
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={(event) =>
                        updateSaleItem(index, "quantity", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-base 
                      text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm text-slate-600">
                    Unit
                    <select
                      value={item.unit}
                      onChange={(event) =>
                        updateSaleItem(index, "unit", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-base 
                      text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                    >
                      <option value="kg">kg</option>
                      <option value="cartons">Cartons</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm text-slate-600">
                    Sale price (₦)
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.price}
                      onChange={(event) =>
                        updateSaleItem(index, "price", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-base 
                      text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                    />
                    <span className="text-xs text-slate-400">
                      No set price — enter manually
                    </span>
                  </label>
                  <button
                    type="button"
                    aria-label="Remove product"
                    disabled={saleItems.length === 1}
                    onClick={() =>
                      setSaleItems((items) =>
                        items.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="justify-self-end rounded p-1 text-slate-500 hover:bg-white 
                    disabled:cursor-not-allowed disabled:opacity-40 lg:justify-self-center"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setSaleItems((items) => [
                    ...items,
                    { product: "", quantity: "", unit: "kg", price: "" },
                  ])
                }
                className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 
                text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 
                focus:ring-teal-blue"
              >
                <Plus size={16} />
                <span>Add another product</span>
              </button>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-700">
                  Sale total:{" "}
                  <strong className="font-semibold">
                    ₦
                    {saleTotal.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </p>
                <Button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#176879] 
                  px-5 text-sm font-semibold text-white transition hover:bg-[#125664] focus:outline-none focus:ring-2 
                  focus:ring-teal-blue focus:ring-offset-2"
                >
                  <Check size={18} />
                  <span>Record sale</span>
                </Button>
              </div>
            </div>
          </form>
        )}

        <section
          aria-labelledby="recorded-sales-title"
          className="overflow-hidden rounded-2xl border border-lighter-teal-blue bg-white"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-lighter-teal-blue px-5 py-4">
            <h2
              id="recorded-sales-title"
              className="text-[12px] font-semibold md:text-lg sm:w-1/2"
            >
              Recorded sales — Central Area, {businessDate}
            </h2>
            <span className="text-lg font-bold tracking-widest leading-6 mt-3 md:mt-0">
              &#8358;0.00
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] table-fixed text-left">
              <thead>
                <tr className="border-b border-lighter-teal-blue text-xs font-medium uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-3 sm:px-4">Sale ref</th>
                  <th className="px-3 py-3 sm:px-4">Product</th>
                  <th className="px-3 py-3 sm:px-4">Kg sold</th>
                  <th className="px-3 py-3 sm:px-4">Cartons sold</th>
                  <th className="px-3 py-3 sm:px-4">Applied price</th>
                  <th className="px-3 py-3 sm:px-4">Total</th>
                  <th className="px-3 py-3 sm:px-4">Vs set price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-9 text-center text-sm text-slate-400"
                  >
                    Nothing recorded for this date yet. Click “Create a sale”
                    above to get started.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
