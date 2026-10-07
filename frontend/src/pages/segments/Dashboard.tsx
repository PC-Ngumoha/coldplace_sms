export default function Dashboard() {
  const products = [
    {
      name: "Chicken, whole",
      code: "CHK-FULL",
      minimum: 40,
      stock: [10, 0, 8],
    },
    { name: "Titus fish", code: "FSH-TIT", minimum: 30, stock: [0, 0, 0] },
    { name: "Beef, cut", code: "BEEF-CUT", minimum: 25, stock: [0, 0, 0] },
    { name: "Turkey, whole", code: "TUR-WHL", minimum: 20, stock: [0, 0, 0] },
  ];
  const locations = ["Central", "Gwarimpa", "Mpape"];
  const metrics = [
    { label: "Active products", value: "4" },
    { label: "Today's sales", value: "₦0" },
    { label: "Transfers in transit", value: "0" },
    { label: "Damage awaiting approval", value: "0" },
    { label: "Low-stock alerts", value: "12", warning: true },
  ];

  return (
    <main className="min-h-screen p-5 font-sans text-slate-900 max-sm:px-1 max-sm:py-4">
      <header>
        <h1 className="mb-1 text-xl md:text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Signed in as Administrator · 2026-10-05 · all locations
        </p>
      </header>

      <section
        className="my-5 grid grid-cols-5 gap-4 max-[900px]:grid-cols-3 max-sm:my-4 max-sm:grid-cols-2 max-sm:gap-2.5"
        aria-label="Dashboard summary"
      >
        {metrics.map((metric) => (
          <article
            className="min-h-24 rounded-2xl border border-slate-200 bg-white px-5 py-[19px] max-sm:min-h-[86px] 
            max-sm:px-[13px] max-sm:py-[15px] last:max-sm:col-span-2"
            key={metric.label}
          >
            <div className="text-sm text-slate-600 max-sm:text-xs">
              {metric.label}
            </div>
            <div
              className={`mt-2.5 text-[26px] leading-none text-slate-950 
                max-sm:text-[23px]${metric.warning ? " text-amber-700" : ""}`}
            >
              {metric.value}
            </div>
          </article>
        ))}
      </section>

      <section className="mb-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white max-sm:mb-3.5 max-sm:rounded-xl">
        <div className="px-5 pb-[17px] pt-5 max-sm:p-4 ">
          <h2 className="mb-1.5 text-[11px] md:text-[17px] font-semibold">
            Stock position by location
          </h2>
          <p className="text-[10px] md:text-[16px] text-slate-500">
            Current balance across all locations, computed from all recorded
            movements
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-left">
            <thead>
              <tr>
                <th
                  className="border-y border-slate-200 px-3 py-[11px] text-[8px] md:text-[13px] font-medium uppercase
                 text-slate-400"
                >
                  Product
                </th>
                {locations.map((location) => (
                  <th
                    className="border-y border-slate-200 px-3 py-[11px] text-right text-[8px] md:text-[13px] font-medium 
                    uppercase text-slate-400"
                    key={location}
                  >
                    {location} (kg)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[9px] md:text-[14px]">
              {products.map((product) => (
                <tr key={product.code}>
                  <td className="border-b border-slate-100 px-3 py-[13px]">
                    <strong>{product.name}</strong>{" "}
                    <span className="text-slate-400">({product.code})</span>
                  </td>
                  {product.stock.map((amount, index) => (
                    <td
                      className="border-b border-slate-100 px-3 py-[13px] text-right font-semibold text-red-700"
                      key={locations[index]}
                    >
                      {amount}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white max-sm:mb-3.5 max-sm:rounded-xl">
        <div className="px-5 pb-[17px] pt-5 max-sm:p-4">
          <h2 className="mb-1.5 text-[11px] md:text-[17px] font-semibold">
            Low stock
          </h2>
          <p className="text-[10px] md:text-[16px] text-slate-500">
            Below the configured minimum for that location
          </p>
        </div>
        <div className="flex flex-wrap gap-x-2.5 gap-y-[9px] border-t border-slate-200 px-5 pb-[17px] pt-2.5 max-sm:gap-2 max-sm:p-3">
          {products.flatMap((product) =>
            locations.map((location, index) => (
              <span
                className="whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 
                text-[9px] md:text-[14px] text-amber-800 max-sm:whitespace-normal"
                key={`${product.code}-${location}`}
              >
                {product.name} · {location}: {product.stock[index]} kg (min{" "}
                {product.minimum})
              </span>
            )),
          )}
        </div>
      </section>
    </main>
  );
}
