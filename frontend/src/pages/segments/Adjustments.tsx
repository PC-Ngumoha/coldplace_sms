import { useState } from "react";

type Adjustment = {
  product: string;
  reason: string;
  location: string;
  change: string;
  requestedBy: string;
  balance: string;
  note: string;
};

const adjustments: Adjustment[] = [
  {
    product: "Chicken Wings",
    reason: "Stock count correction",
    location: "Central Area",
    change: "−5.000 kg",
    requestedBy: "Raji Aduke",
    balance: "340.000 kg",
    note: "Physical count found 335 kg during the morning check.",
  },
  {
    product: "Tilapia",
    reason: "Weighing error",
    location: "Mape Outlet",
    change: "+12.000 kg",
    requestedBy: "Abdulbasit Ibrahim",
    balance: "128.000 kg",
    note: "Updated after a second weighing.",
  },
  {
    product: "Beef Cuts",
    reason: "Spillage during packing",
    location: "Gwarimpa Outlet",
    change: "−3.500 kg",
    requestedBy: "You",
    balance: "72.000 kg",
    note: "A small amount was lost during packing.",
  },
];

export default function Adjustments() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [location, setLocation] = useState("All locations");
  const [status, setStatus] = useState("Pending");
  const [selected, setSelected] = useState(0);
  const [rejectionNote, setRejectionNote] = useState("");
  const [message, setMessage] = useState("");
  const [showNewAdjustment, setShowNewAdjustment] = useState(false);

  const current = adjustments[selected];
  const afterBalance =
    selected === 0 ? "335.000 kg" : selected === 1 ? "140.000 kg" : "68.500 kg";

  return (
    <main className="min-h-screen px-4 py-6 text-slate-800 sm:px-7 sm:py-7">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[22px] font-bold leading-7 tracking-tight">
              Adjustments
            </h1>
            <p className="mt-1 text-[13px] text-slate-500">
              Stock changes stay pending until an approver confirms them.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewAdjustment(true)}
            className="rounded-lg bg-teal-blue px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue focus:ring-offset-2"
          >
            New adjustment
          </button>
        </header>

        <nav
          className="mt-5 flex gap-1 border-b border-slate-200"
          aria-label="Adjustment views"
        >
          {["Pending", "My requests", "All"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-3 py-3 text-[13px] font-medium transition ${
                activeTab === tab
                  ? "border-teal-700 text-teal-800"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
              {tab === "Pending" ? " (3)" : ""}
            </button>
          ))}
        </nav>

        <div className="mt-4 flex flex-wrap gap-3">
          <label className="grid gap-1 text-[11px] font-medium text-slate-500">
            Location
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="h-9 min-w-32 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-normal text-slate-800 shadow-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
            >
              <option>All locations</option>
              <option>Central Area</option>
              <option>Mape Outlet</option>
              <option>Gwarimpa Outlet</option>
            </select>
          </label>
          <label className="grid gap-1 text-[11px] font-medium text-slate-500">
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-9 min-w-24 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-normal text-slate-800 shadow-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
            >
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>All statuses</option>
            </select>
          </label>
        </div>

        <div className="mt-3 grid items-start gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,1fr)]">
          <section
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            aria-label="Adjustment requests"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[610px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    <th className="px-3.5 py-3">Product</th>
                    <th className="px-3.5 py-3">Location</th>
                    <th className="px-3.5 py-3 text-right">Change</th>
                    <th className="px-3.5 py-3">Requested by</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center">
                        <p className="text-[13px] font-semibold text-slate-700">
                          No adjustment requests
                        </p>
                        <p className="mt-1 text-[12px] text-slate-500">
                          New requests will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    adjustments.map((item, index) => (
                      <tr
                        key={item.product}
                        onClick={() => {
                          setSelected(index);
                          setMessage("");
                        }}
                        className={`cursor-pointer border-b border-slate-200 text-[13px] transition last:border-b-0 hover:bg-teal-50 ${
                          selected === index ? "bg-[#e4f2f0]" : "bg-white"
                        }`}
                      >
                        <td className="px-3.5 py-3">
                          <div className="font-semibold text-slate-800">
                            {item.product}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {item.reason}
                          </div>
                        </td>
                        <td className="px-3.5 py-3">{item.location}</td>
                        <td
                          className={`px-3.5 py-3 text-right font-semibold ${item.change.startsWith("+") ? "text-teal-800" : "text-red-700"}`}
                        >
                          {item.change}
                        </td>
                        <td className="px-3.5 py-3 whitespace-nowrap">
                          {item.requestedBy === "You" ? (
                            <span className="flex items-center gap-2">
                              You{" "}
                              <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] text-violet-700">
                                Your request
                              </span>
                            </span>
                          ) : (
                            item.requestedBy
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="border-t border-slate-100 px-3.5 py-3 text-[11px] text-slate-500">
              Oldest first. Approved and rejected requests stay in the All tab.
            </p>
          </section>

          <section
            className="rounded-xl border border-slate-200 bg-white p-4 sm:p-[17px]"
            aria-label="Selected adjustment details"
          >
            {adjustments.length === 0 ? (
              <div className="py-10 text-center">
                <h2 className="text-[15px] font-bold text-slate-700">
                  Nothing to review
                </h2>
                <p className="mt-1 text-[13px] text-slate-500">
                  Select a request to see its details.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[15px] font-bold">{current.product}</h2>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-800">
                    Pending
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-[18px] text-slate-500">
                  {current.location} · filed by {current.requestedBy}, 17 Nov
                  09:12
                </p>

                <div className="mt-3 rounded-lg border border-slate-200 px-3 py-2.5 text-[13px]">
                  <div className="flex justify-between gap-3 text-slate-500">
                    <span>Current balance</span>
                    <span className="text-slate-800">{current.balance}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between gap-3 text-slate-500">
                    <span>Requested change</span>
                    <span
                      className={`font-semibold ${current.change.startsWith("+") ? "text-teal-800" : "text-red-700"}`}
                    >
                      {current.change}
                    </span>
                  </div>
                  <div className="mt-1.5 flex justify-between gap-3 border-t border-slate-200 pt-1.5 font-semibold text-slate-700">
                    <span>Balance after approval</span>
                    <span>{afterBalance}</span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Reason
                </div>
                <p className="text-[13px] text-slate-800">{current.reason}</p>
                <div className="mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Note
                </div>
                <p className="text-[13px] leading-[18px] text-slate-800">
                  {current.note}
                </p>

                <label
                  htmlFor="rejection-note"
                  className="mt-3 block text-[11px] text-slate-500"
                >
                  Rejection note (required to reject)
                </label>
                <textarea
                  id="rejection-note"
                  value={rejectionNote}
                  onChange={(event) => setRejectionNote(event.target.value)}
                  rows={2}
                  className="mt-1 h-[46px] w-full resize-y rounded-lg border border-slate-300 px-2.5 py-2 text-[13px] outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                />
                {message && (
                  <p role="status" className="mt-2 text-[12px] text-teal-800">
                    {message}
                  </p>
                )}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMessage("Adjustment approved.")}
                    className="rounded-lg bg-teal-blue px-3 py-2.5 text-[13px] font-semibold text-white transition hover:bg-darker-teal-blue
                    focus:outline-none focus:ring-2 focus:ring-teal-blue focus:ring-offset-2"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMessage(
                        rejectionNote.trim()
                          ? "Adjustment rejected."
                          : "Add a rejection note before rejecting.",
                      )
                    }
                    className="rounded-lg border border-red-500 px-3 py-2.5 text-[13px] font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Reject
                  </button>
                </div>
                <p className="mt-3 text-[11px] leading-[16px] text-slate-500">
                  If you approved your own request, it would be recorded as
                  self-approved in the audit log.
                </p>
              </>
            )}
          </section>
        </div>
      </div>

      {showNewAdjustment && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-adjustment-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="new-adjustment-title" className="text-lg font-bold">
                New adjustment
              </h2>
              <button
                type="button"
                onClick={() => setShowNewAdjustment(false)}
                aria-label="Close"
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Create a stock adjustment request for approval.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowNewAdjustment(false)}
                className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
