import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Transfers() {
  return (
    <main className="min-h-full bg-lightest-teal-blue px-4 py-6 text-slate-900 sm:px-5 sm:py-6">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="md:w-1/2">
            <h1 className="text-xl md:text-2xl font-semibold leading-tight">
              Transfers
            </h1>
            <p className="mt-1 text-[12px] md:text-[16px] text-slate-500">
              Dispatch from Central Area, receipt confirmed at the outlet
            </p>
          </div>
          <Button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 self-start rounded-xl 
            bg-teal-blue p-5 text-sm font-semibold text-white transition 
            hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue
            focus:ring-offset-2 sm:w-auto sm:self-auto"
          >
            <Plus size={18} />
            <span>New transfer</span>
          </Button>
        </header>

        <section className="overflow-hidden rounded-2xl border border-lightest-teal-blue bg-white">
          <h2 className="border-b border-lighter-teal-blue px-5 py-4 text-lg font-medium">
            Transfer history
          </h2>

          <table className="w-full border-separate border-spacing-0 text-left">
            <thead className="hidden lg:table-header-group">
              <tr className="border-b border-lighter-teal-blue text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3 font-medium">Ref</th>
                <th className="px-3 py-3 font-medium">To</th>
                <th className="px-3 py-3 font-medium">Dispatched</th>
                <th className="px-3 py-3 font-medium">Received</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-lighter-teal-blue">
              {/* TODO: Static data - will be replaced later */}
              <tr className="grid gap-3 p-4 lg:table-row lg:p-0">
                <td className="flex items-center justify-between gap-3 lg:table-cell lg:px-3 lg:py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                    Ref
                  </span>
                  <span className="font-mono text-sm font-semibold">
                    TRF-0001
                  </span>
                </td>
                <td className="flex items-center justify-between gap-3 lg:table-cell lg:px-3 lg:py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                    To
                  </span>
                  <span className="text-sm">Mape Outlet</span>
                </td>
                <td className="flex items-center justify-between gap-3 lg:table-cell lg:px-3 lg:py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                    Dispatched
                  </span>
                  <span className="text-sm">2026-09-24</span>
                </td>
                <td className="flex items-center justify-between gap-3 lg:table-cell lg:px-3 lg:py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                    Received
                  </span>
                  <span className="text-sm">2026-09-24</span>
                </td>
                <td className="flex items-center justify-between gap-3 lg:table-cell lg:px-3 lg:py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                    Status
                  </span>
                  <span
                    className="inline-flex rounded-full border border-slate-300 bg-lighter-teal-blue 
                  px-3 py-1 text-xs font-medium text-emerald-700"
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
