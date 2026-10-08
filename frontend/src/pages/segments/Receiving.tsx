import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Receiving() {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState([1]); // TODO: Find a better way to represent product lines.

  const toggleFormVisibility = () => setIsOpen((visible) => !visible);

  // TODO: This logic should be fixed when a better way to represent product lines is
  // introduced.
  const addProductLine = () => setLines((lines) => [...lines, 1]);
  const removeProductLine = (idx: number) =>
    setLines((lines) => {
      const newLines = lines.filter((_, i) => i !== idx);

      return [...newLines];
    });

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
                <span>Close</span>
              </>
            )}
          </Button>
        </header>

        {/* Add receiving form. */}
        {isOpen && (
          <form
            className="mb-5 rounded-xl border border-lighter-teal-blue bg-white p-4 sm:p-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col text-xs font-medium text-slate-600">
                Supplier / seller
                <input
                  className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  name="supplier"
                  placeholder="e.g. Bulkstar Foods Ltd"
                  required
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-slate-600">
                Delivery reference
                <input
                  className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  name="deliveryReference"
                  placeholder="Waybill / invoice no."
                />
                <span className="mt-1 block text-[11px] text-slate-400">
                  Optional
                </span>
              </label>
              <label className="flex flex-col text-xs font-medium text-slate-600">
                Receipt date
                <input
                  className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  type="date"
                  name="receiptDate"
                  defaultValue="2026-10-08"
                  required
                />
              </label>
            </div>

            <fieldset className="mt-5">
              <legend className="mb-2 text-xs font-medium text-slate-500">
                Product lines
              </legend>
              <div className="space-y-2">
                {lines.map((line, idx) => (
                  <div
                    key={line}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 rounded-lg bg-lightest-teal-blue p-2 
                    sm:items-end"
                  >
                    <label className="flex flex-col text-xs font-medium text-slate-600">
                      Product
                      <select
                        className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        name={`product-${line}`}
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          Select…
                        </option>
                      </select>
                    </label>
                    <label className="flex flex-col text-xs font-medium text-slate-600">
                      Accepted qty
                      <input
                        className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        type="number"
                        min="0"
                        step="any"
                        name={`accepted-${line}`}
                        required
                      />
                    </label>
                    <label className="flex flex-col text-xs font-medium text-slate-600">
                      Unit
                      <select
                        className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        name={`unit-${line}`}
                        defaultValue="kg"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="piece">piece</option>
                        <option value="box">box</option>
                        <option value="litre">litre</option>
                      </select>
                    </label>
                    <label className="flex flex-col text-xs font-medium text-slate-600">
                      Transit-damaged qty
                      <input
                        className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        type="number"
                        min="0"
                        step="any"
                        name={`damaged-${line}`}
                      />
                      <span className="mt-1 block text-[11px] text-slate-400">
                        Same unit
                      </span>
                    </label>
                    <div className="flex items-end gap-2">
                      <label className="flex min-w-0 flex-1 flex-col text-xs font-medium text-slate-600">
                        Purchase cost (per accepted qty)
                        <input
                          className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                          type="number"
                          min="0"
                          step="any"
                          name={`cost-${line}`}
                        />
                      </label>
                    </div>
                    {/* Remove this product line */}
                    <Button
                      variant="ghost"
                      className="text-teal-blue hover:bg-transparent"
                      onClick={() => removeProductLine(idx)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Add a new product line */}
            <Button
              variant="ghost"
              className="my-4 border border-lighter-teal-blue"
              onClick={addProductLine}
            >
              <Plus size={16} />
              <span>Add line</span>
            </Button>

            <label className="mt-4 flex flex-col text-xs font-medium text-slate-600">
              Notes / delivery condition
              <textarea
                className="mt-1 min-h-20 resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                name="notes"
                rows={2}
              />
              <span className="mt-1 block text-[11px] text-slate-400">
                Optional
              </span>
            </label>
            <Button
              type="submit"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-blue px-4 py-2 text-sm font-semibold
               text-white hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue 
               focus:ring-offset-2"
            >
              <span aria-hidden="true">✓</span>
              Record receiving
            </Button>
          </form>
        )}

        <section className="overflow-auto rounded-lg md:rounded-xl lg:rounded-2xl border border-lighter-teal-blue bg-white">
          <h2 className="border-b border-lighter-teal-blue px-3 py-6 text-base font-semibold">
            Receiving history
          </h2>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-left">
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
                  <th scope="col" className="px-3 py-3 sm:px-5">
                    Lines
                  </th>
                  <th scope="col" className="px-3 py-3 text-right sm:px-5">
                    Damaged lines
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lighter-teal-blue">
                {/* TODO: Static placeholder data, will be replaced later on. */}
                <tr className="px-4 py-2 table-row text-sm font-mono">
                  <td className="table-cell px-3 py-3 font-semibold">
                    TRF-0001
                  </td>
                  <td className="table-cell px-3 py-3">2026-09-24</td>
                  <td className="table-cell px-3 py-3">Timothy foods</td>
                  <td className="table-cell px-3 py-3">Chicken, whole</td>
                  <td className="table-cell px-3 py-3 text-right">———</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
