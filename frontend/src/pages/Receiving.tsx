import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Receiving() {
  return (
    <main className="min-h-screen bg-lightest-teal-blue px-2 py-4 text-slate-900">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Receiving
            </h1>
            <p className="mt-1 text-[12px] tracking-wide md:text-[16px] text-slate-500">
              Bulk goods received at the Central Area
            </p>
          </div>
          <Button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-blue p-5 text-sm font-semibold 
            text-white transition-colors hover:bg-darker-teal-blue focus:outline-none focus:ring-2 
            focus:ring-teal-blue focus:ring-offset-2 sm:w-auto"
          >
            <Plus size={18} />
            <span>New receiving</span>
          </Button>
        </div>

        <section className="overflow-auto rounded-lg md:rounded-xl lg:rounded-2xl border border-lighter-teal-blue bg-white">
          <h2 className="border-b border-lighter-teal-blue px-3 py-6 text-base font-semibold">
            Receiving history
          </h2>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-left">
              <thead className="hidden lg:table-header-group">
                <tr
                  className="border-b border-lighter-teal-blue text-[9px] md:text-[16px] font-semibold uppercase 
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
                <tr className="grid gap-3 px-4 py-2 lg:table-row lg:p-0">
                  <td className="flex items-center justify-between gap-3 lg:table-cell lg:px-3 lg:py-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                      Reference
                    </span>
                    <span className="font-mono text-sm font-semibold">
                      TRF-0001
                    </span>
                  </td>
                  <td className="flex items-center justify-between gap-3 lg:table-cell lg:px-3 lg:py-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                      Date
                    </span>
                    <span className="text-sm">2026-09-24</span>
                  </td>
                  <td className="flex items-center justify-between gap-3 lg:table-cell lg:px-3 lg:py-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                      Supplier
                    </span>
                    <span className="text-sm">Timothy foods</span>
                  </td>
                  <td className="flex items-center justify-between gap-3 lg:table-cell lg:px-3 lg:py-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                      Lines
                    </span>
                    <span className="text-sm">Chicken, whole</span>
                  </td>
                  <td className="flex items-center justify-between gap-3 lg:table-cell lg:px-3 lg:py-3 text-right">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 lg:hidden">
                      Damaged Lines
                    </span>
                    <span className="text-sm">———</span>
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
