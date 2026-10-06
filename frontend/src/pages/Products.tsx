import { Button } from "@/components/ui/button";

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

  return (
    <main className="min-h-screen bg-[#edf4f4] px-4 py-5 text-slate-900 sm:px-1 sm:py-4">
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-7">Products</h1>
            <p className="mt-1 text-sm text-slate-500">
              Product setup, units, and carton conversion
            </p>
          </div>
          <Button className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-blue p-5 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 sm:w-auto">
            <span
              aria-hidden="true"
              className="text-xl font-light leading-none"
            >
              +
            </span>
            New product
          </Button>
        </header>

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
                    className="h-14 border-b border-[#edf1f2] last:border-b-0 text-[10px] lg:text-[13px]"
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
