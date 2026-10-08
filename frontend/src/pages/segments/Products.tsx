import { Button } from "@/components/ui/button";
import { Check, Plus, X } from "lucide-react";
import { useState } from "react";

export default function Products() {
  const products = [
    {
      code: "CHK-FULL",
      name: "Chicken, whole",
      category: "Chicken",
      carton: 10,
      minStock: 40,
    },
    {
      code: "FSH-TIT",
      name: "Titus fish",
      category: "Fish",
      carton: 12,
      minStock: 30,
    },
    {
      code: "BEEF-CUT",
      name: "Beef, cut",
      category: "Meat",
      carton: 15,
      minStock: 25,
    },
    {
      code: "TUR-WHL",
      name: "Turkey, whole",
      category: "Meat",
      carton: 12,
      minStock: 20,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  const toggleFormVisibility = () => setIsOpen((visible) => !visible);

  return (
    <main className="min-h-screen px-4 py-5 text-slate-900 sm:px-1 sm:py-4">
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold leading-7">
              Products
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Product setup, units, and carton conversion
            </p>
          </div>
          <Button
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl
           bg-teal-blue p-5 text-sm font-semibold text-white transition hover:bg-teal-900 
           focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 sm:w-auto"
            onClick={toggleFormVisibility}
          >
            {!isOpen ? (
              <>
                <Plus size={18} />
                <span>New product</span>
              </>
            ) : (
              <>
                <X size={18} />
                <span>Close</span>
              </>
            )}
          </Button>
        </header>

        {/* Add Product form */}
        {isOpen && (
          <form
            onSubmit={(event) => event.preventDefault()}
            className="mb-4 rounded-2xl border border-lightest-teal-blue bg-white p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label
                  htmlFor="product-name"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Product name
                </label>
                <input
                  id="product-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Chicken, whole"
                  required
                  className="w-full rounded-lg border border-lightest-teal-blue px-2.5 py-2 text-sm outline-none
                   placeholder:text-slate-400 focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
              </div>
              <div>
                <label
                  htmlFor="product-code"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Product code / SKU
                </label>
                <input
                  id="product-code"
                  name="code"
                  type="text"
                  placeholder="e.g. CHK-FULL"
                  required
                  className="w-full rounded-lg border border-lightest-teal-blue px-2.5 py-2 text-sm outline-none
                   placeholder:text-slate-400 focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
              </div>
              <div>
                <label
                  htmlFor="product-category"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Category
                </label>
                <select
                  id="product-category"
                  name="category"
                  defaultValue="Chicken"
                  className="w-full rounded-lg border border-lightest-teal-blue bg-white px-2.5 py-2 text-sm outline-none
                   focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                >
                  <option>Chicken</option>
                  <option>Fish</option>
                  <option>Meat</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="carton-conversion"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Carton conversion (kg per carton)
                </label>
                <input
                  id="carton-conversion"
                  name="carton"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="10"
                  className="w-full rounded-lg border border-lightest-teal-blue px-2.5 py-2 text-sm outline-none
                   placeholder:text-slate-400 focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Leave blank if sold by kg only
                </p>
              </div>
              <div>
                <label
                  htmlFor="minimum-stock"
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Minimum stock level (kg)
                </label>
                <input
                  id="minimum-stock"
                  name="minStock"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="30"
                  className="w-full rounded-lg border border-lightest-teal-blue px-2.5 py-2 text-sm outline-none
                   placeholder:text-slate-400 focus:border-teal-blue focus:ring-2 focus:ring-teal-blue/20"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Optional, for low-stock alerts
                </p>
              </div>
            </div>
            <Button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-blue px-4 py-2 text-sm font-medium
               text-white hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
            >
              <Check size={16} />
              Save product
            </Button>
          </form>
        )}

        <section
          aria-label="Product list"
          className="overflow-x-auto rounded-2xl border border-lightest-teal-blue bg-white"
        >
          <div className="hidden overflow-x-auto lg:block p-5">
            <table className="w-full min-w-[680px] table-fixed border-collapse text-sm lg:min-w-[760px]">
              <thead>
                <tr
                  className="h-10 border-b border-lightest-teal-blue text-left text-[10px] lg:text-[13px] font-medium uppercase 
                tracking-wide text-slate-500"
                >
                  <th className="px-2 lg:px-3">Code</th>
                  <th className="px-2 lg:px-3">Name</th>
                  <th className="px-2 lg:px-3">Category</th>
                  <th className="px-2 text-right lg:px-3">Carton = kg</th>
                  <th className="px-2 text-right lg:px-3">Min stock</th>
                  <th className="px-2 lg:px-3">Status</th>
                  <th className="px-2 lg:px-3" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.code}
                    className="h-14 border-b border-lightest-teal-blue last:border-b-0 text-[10px] lg:text-[13px]"
                  >
                    <td className="px-2 font-mono lg:px-3">{product.code}</td>
                    <td className="px-2 font-medium lg:px-3">{product.name}</td>
                    <td className="px-2 lg:px-3">{product.category}</td>
                    <td className="px-2 text-right tabular-nums lg:px-3">
                      {product.carton}
                    </td>
                    <td className="px-2 text-right tabular-nums lg:px-3">
                      {product.minStock}
                    </td>
                    <td className="px-2 lg:px-3">
                      <span
                        className="inline-flex rounded-full border border-lighter-teal-blue bg-lighter-teal-blue px-2.5 py-1 text-xs 
                      font-medium leading-none text-emerald-700"
                      >
                        Active
                      </span>
                    </td>
                    <td className="px-2 lg:px-3 wrap-break-word break-all">
                      <Button
                        variant="secondary"
                        className="whitespace-nowrap rounded-lg border border-lightest-teal-blue px-3 py-2 font-medium text-slate-900 
                        transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-blue"
                      >
                        Deactivate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile & Tablet view */}
          <ul className="divide-y divide-lighter-teal-blue lg:hidden">
            {products.map((product) => (
              <li key={product.code} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="wrap-break-word font-medium">
                      {product.name}
                    </h2>
                    <p className="mt-1 font-mono text-xs text-slate-500">
                      {product.code}
                    </p>
                  </div>
                  <span
                    className="inline-flex shrink-0 rounded-full border border-lighter-teal-blue bg-lightest-teal-blue px-2.5
                    py-1 text-xs font-medium leading-none text-emerald-700"
                  >
                    Active
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-slate-500">Category</dt>
                    <dd className="mt-1">{product.category}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Carton = kg</dt>
                    <dd className="mt-1 tabular-nums">{product.carton}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Min stock</dt>
                    <dd className="mt-1 tabular-nums">{product.minStock}</dd>
                  </div>
                </dl>
                <Button
                  variant="secondary"
                  className="mt-4 w-full rounded-lg border border-lighter-teal-blue px-3 py-2 font-medium text-slate-900 transition 
                  hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-blue"
                >
                  Deactivate
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
