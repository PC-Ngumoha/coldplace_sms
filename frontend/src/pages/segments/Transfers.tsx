import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Transfers() {
  const [isOpen, setIsOpen] = useState(false);
  const [productLines, setProductLines] = useState([
    { id: 1, product: "", quantity: "", unit: "kg" },
  ]);

  const toggleFormVisibility = () => setIsOpen((visible) => !visible);

  const updateProductLine = (
    id: number,
    field: "product" | "quantity" | "unit",
    value: string,
  ) => {
    setProductLines((lines) =>
      lines.map((line) =>
        line.id === id ? { ...line, [field]: value } : line,
      ),
    );
  };

  return (
    <main className="min-h-full px-4 py-6 text-slate-900 sm:px-5 sm:py-6">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="md:w-1/2">
            <h1 className="text-xl md:text-2xl font-semibold leading-7">
              Transfers
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Dispatch from Central Area, receipt confirmed at the outlet
            </p>
          </div>
          <Button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 self-start rounded-xl 
            bg-teal-blue p-5 text-sm font-semibold text-white transition 
            hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue
            focus:ring-offset-2 sm:w-auto sm:self-auto"
            onClick={toggleFormVisibility}
          >
            {!isOpen ? (
              <>
                <Plus size={18} />
                <span>New transfer</span>
              </>
            ) : (
              <>
                <X size={18} />
                <span>Close</span>
              </>
            )}
          </Button>
        </header>

        {/* Add transfers form. */}
        {isOpen && (
          <form
            className="mb-5 rounded-xl border border-lightest-teal-blue bg-white p-4 sm:p-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block text-sm font-medium text-slate-600">
                Destination outlet
                <select
                  defaultValue="Gwarimpa Outlet"
                  className="mt-1.5 block h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-900 
                  outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                >
                  <option>Gwarimpa Outlet</option>
                  <option>Mape Outlet</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-600">
                Dispatch date
                <input
                  type="date"
                  defaultValue="2026-10-08"
                  className="mt-1.5 block h-11 w-full rounded-lg border border-slate-200 bg-white px-3 
                  text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-600">
                Expected receipt date
                <input
                  type="date"
                  defaultValue="2026-10-08"
                  className="mt-1.5 block h-11 w-full rounded-lg border border-slate-200 bg-white px-3 
                  text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
              </label>
            </div>

            <fieldset className="mt-4">
              <legend className="mb-2 text-sm font-medium text-slate-600">
                Product lines
              </legend>
              <div className="space-y-2">
                {productLines.map((line) => (
                  <div
                    key={line.id}
                    className="grid grid-cols-1 items-end gap-2 rounded-lg bg-slate-100 p-2.5 
                    sm:grid-cols-[minmax(0,1.7fr)_minmax(0,0.95fr)_minmax(0,0.75fr)_32px] sm:gap-2.5"
                  >
                    <label className="block text-sm font-medium text-slate-600">
                      Product
                      <select
                        value={line.product}
                        onChange={(event) =>
                          updateProductLine(
                            line.id,
                            "product",
                            event.target.value,
                          )
                        }
                        className="mt-1 block h-11 w-full rounded-lg border border-slate-200 bg-white px-3
                         text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                      >
                        <option value="">Select a product</option>
                        <option value="rice">Rice</option>
                        <option value="beans">Beans</option>
                        <option value="oil">Cooking oil</option>
                      </select>
                    </label>
                    <label className="block text-sm font-medium text-slate-600">
                      Quantity
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={line.quantity}
                        onChange={(event) =>
                          updateProductLine(
                            line.id,
                            "quantity",
                            event.target.value,
                          )
                        }
                        className="mt-1 block h-11 w-full rounded-lg border border-slate-200 bg-white px-3 
                        text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-600">
                      Unit
                      <select
                        value={line.unit}
                        onChange={(event) =>
                          updateProductLine(line.id, "unit", event.target.value)
                        }
                        className="mt-1 block h-11 w-full rounded-lg border border-slate-200 bg-white px-3 
                        text-slate-900 outline-none focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="litre">litre</option>
                        <option value="unit">unit</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      aria-label="Remove product line"
                      onClick={() =>
                        setProductLines((lines) =>
                          lines.filter((item) => item.id !== line.id),
                        )
                      }
                      className="flex h-10 w-full items-center justify-center rounded-lg text-slate-500 transition 
                      hover:bg-white hover:text-slate-800 sm:mb-0.5 sm:h-11 sm:w-8"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button
                type="button"
                onClick={() =>
                  setProductLines((lines) => [
                    ...lines,
                    { id: Date.now(), product: "", quantity: "", unit: "kg" },
                  ])
                }
                className="inline-flex items-center gap-2 rounded-lg border border-lightest-teal-blue bg-white 
                px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                <Plus size={17} />
                Add line
              </Button>
              <Button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue focus:ring-offset-2"
              >
                <span aria-hidden="true">✓</span>
                Dispatch transfer
              </Button>
            </div>
          </form>
        )}

        <section className="overflow-x-auto rounded-2xl border border-lightest-teal-blue bg-white">
          <h2 className="border-b border-lighter-teal-blue px-5 py-4 text-lg font-medium">
            Transfer history
          </h2>

          <table className="w-full min-w-max border-separate border-spacing-0 text-left">
            <thead className="table-header-group">
              <tr className="border-b border-lighter-teal-blue text-sm font-medium uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3 font-medium">Ref</th>
                <th className="px-3 py-3 font-medium">To</th>
                <th className="px-3 py-3 font-medium">Dispatched</th>
                <th className="px-3 py-3 font-medium">Received</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-lighter-teal-blue">
              {/* TODO: Static data - will be replaced later */}
              <tr className="text-sm p-4 table-row font-mono">
                <td className="table-cell px-3 py-3 font-semibold">TRF-0001</td>
                <td className="table-cell px-3 py-3">Mape Outlet</td>
                <td className="table-cell px-3 py-3">2026-09-24</td>
                <td className="table-cell px-3 py-3">2026-09-24</td>
                <td className="table-cell px-3 py-3">
                  <span
                    className="inline-flex rounded-full border border-slate-300 bg-lighter-teal-blue 
                  px-3 py-1 text-xs font-medium text-teal-blue"
                  >
                    Received
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
