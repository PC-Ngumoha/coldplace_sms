import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Receiving() {
  return (
    <main className="min-h-screen px-2 py-4 text-slate-900">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
