import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold leading-7">Pricing</h1>
          <p className="mt-1 text-sm text-slate-400">
            One selling price per product, set by the Central Area — applies
            automatically at Gwarimpa and Mpape
          </p>
        </header>

        <section className="mb-5 overflow-hidden rounded-2xl border border-lighter-teal-blue bg-white">
          <div className="border-b border-lighter-teal-blue px-5 py-4">
            <h2 className="font-semibold">Set a price</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              This price will apply at Central Area, Gwarimpa, and Mpape from
              the effective date
            </p>
          </div>

          <form className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
            <label className="block text-sm font-medium text-slate-600">
              <span className="mb-1 block">Product</span>
              <select
                defaultValue=""
                className="h-11 w-full rounded-lg border border-lighter-teal-blue bg-white px-4 text-base
                font-normal text-slate-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
              >
                <option value="" disabled>
                  Select…
                </option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-600">
              <span className="mb-1 block">Unit</span>
              <select
                defaultValue="kg"
                className="h-11 w-full rounded-lg border border-lighter-teal-blue bg-white px-4 text-base font-normal
                text-slate-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
              >
                <option value="kg">kg</option>
                <option value="carton">carton</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-600">
              <span className="mb-1 block">Selling price (₦)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="h-11 w-full rounded-lg border border-lighter-teal-blue bg-white px-4 text-base
                font-normal text-slate-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
              />
            </label>

            <label className="block text-sm font-medium text-slate-600">
              <span className="mb-1 block">Effective date</span>
              <input
                type="date"
                defaultValue="2026-10-06"
                className="h-11 w-full rounded-lg border border-lighter-teal-blue bg-white px-3 text-base
                font-normal text-slate-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
              />
            </label>

            <Button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-blue px-5 font-semibold
              text-white transition hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue
              focus:ring-offset-2 sm:col-span-2 lg:col-span-1"
            >
              <Check size={18} />
              <span>Save price</span>
            </Button>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-lighter-teal-blue bg-white">
          <div className="border-b border-lighter-teal-blue px-5 py-4">
            <h2 className="font-semibold">Current prices</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Applies to all three locations
            </p>
          </div>
          <div
            className="grid grid-cols-3 border-b border-lighter-teal-blue px-3 py-3 text-xs font-medium uppercase tracking-wide
          text-slate-400 sm:px-5"
          >
            <span>Product</span>
            <span className="text-center">Price / kg</span>
            <span className="text-right">Price / carton</span>
          </div>
          <div className="flex min-h-[88px] items-center justify-center px-4 py-6 text-sm text-slate-400">
            No prices set yet.
          </div>
        </section>
      </div>
    </main>
  );
}
