import { Button } from "@/components/ui/button";
import { Plus, FileChartColumnIncreasing } from "lucide-react";

export default function Sales() {
  const businessDate = "2026-10-06";

  return (
    <main className="min-h-screen bg-lightest-teal-blue px-2 py-5 text-slate-900 lg:px-5">
      <div className="mx-auto w-full max-w-[1500px]">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="md:w-1/3">
            <h1 className="text-2xl font-semibold leading-tight">Sales</h1>
            <p className="mt-1 text-sm text-slate-500">
              Record sales as they happen, then generate a report for any period
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl 
              bg-teal-blue px-5 text-sm font-semibold text-white transition 
              hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue focus:ring-offset-2"
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
