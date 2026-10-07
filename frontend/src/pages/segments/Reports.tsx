import { useState } from "react";

export default function Reports() {
  const [report, setReport] = useState("Sales report");
  const [period, setPeriod] = useState("Monthly (this month)");
  const [location, setLocation] = useState("All locations");

  const exportCsv = () => {
    const columns = [
      "DATE",
      "LOCATION",
      "PRODUCT",
      "QTY (KG)",
      "QTY (CARTON)",
      "APPLIED PRICE",
      "TOTAL",
      "SET-PRICE TOTAL",
      "VARIANCE",
      "VARIANCE %",
    ];
    const csv = `${columns.join(",")}\n`;
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const fieldClass = `mt-1 h-11 w-full rounded-lg border border-lightest-teal-blue bg-white px-4 text-[15px] font-normal 
    text-slate-500 outline-none focus:border-lighter-teal-blue focus:ring-2 focus:ring-slate-900/20`;

  const columns = [
    "Date",
    "Location",
    "Product",
    "Qty (kg)",
    "Qty (carton)",
    "Applied price",
    "Total",
    "Set-price total",
    "Variance",
    "Variance %",
  ];

  return (
    <main
      className="min-h-screen px-4 py-6 text-slate-900
    sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-7">Reports</h1>
            <p className="mt-1 text-sm text-slate-400">
              Filter, review, and export operational reports
            </p>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-amber-600
            px-5 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 
            focus:ring-amber-600 focus:ring-offset-2 sm:self-auto"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3"
              />
            </svg>
            Export CSV
          </button>
        </header>

        <section
          aria-label="Report filters"
          className="rounded-2xl border border-lighter-teal-blue bg-white p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="block text-sm font-medium text-slate-500">
              Report
              <select
                className={fieldClass}
                value={report}
                onChange={(event) => setReport(event.target.value)}
              >
                <option>Sales report</option>
                <option>Inventory report</option>
                <option>Payments report</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-500">
              Period
              <select
                className={fieldClass}
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
              >
                <option>Monthly (this month)</option>
                <option>Weekly (this week)</option>
                <option>Daily (today)</option>
                <option>Custom date range</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-500">
              Location
              <select
                className={fieldClass}
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              >
                <option>All locations</option>
              </select>
            </label>
          </div>
          <p className="mt-5 text-sm text-slate-400">
            Reporting period: 2026-09-30 to 2026-10-06{" "}
            <span aria-hidden="true">·</span> generated 06/10/2026, 16:47:26
          </p>
        </section>

        <section
          aria-label={`${report} results`}
          className="mt-5 overflow-hidden rounded-2xl border border-lightest-teal-blue bg-white"
        >
          <div className="flex min-h-[60px] items-center justify-between border-b border-lightest-teal-blue px-5 sm:px-6">
            <h2 className="font-semibold">{report}</h2>
            <span className="font-semibold tabular-nums">₦0</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse overflow-x-auto text-left">
              <thead>
                <tr className="border-b border-lighter-teal-blue">
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="whitespace-nowrap px-3 py-3 text-xs font-medium uppercase tracking-wide 
                      text-slate-400 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-lightest-teal-blue bg-white text-sm text-slate-700">
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    2026-09-30
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    Main branch
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    Fresh tomatoes
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    180.00
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    12
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    ₦1,100.00
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    ₦198,000.00
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    ₦196,000.00
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    ₦2,000.00
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    1.02%
                  </td>
                </tr>
                <tr className="bg-white text-sm text-slate-700">
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    2026-10-01
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    North depot
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    Red pepper
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    240.00
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    16
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    ₦1,350.00
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    ₦324,000.00
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    ₦318,000.00
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    ₦6,000.00
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:px-4 sm:first:pl-6 sm:last:pr-6">
                    1.85%
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
