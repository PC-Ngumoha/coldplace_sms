import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Transfers() {
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
          >
            <Plus size={18} />
            <span>New transfer</span>
          </Button>
        </header>

        <section className="overflow-x-auto rounded-2xl border border-lightest-teal-blue bg-white">
          <h2 className="border-b border-lighter-teal-blue px-5 py-4 text-lg font-medium">
            Transfer history
          </h2>

          <table className="w-full border-separate border-spacing-0 text-left">
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
