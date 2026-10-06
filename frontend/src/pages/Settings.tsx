import { useMemo, useState } from "react";

const users = [
  {
    name: "Abdulbasit Bello",
    email: "abdul@thecoldplace.com",
    role: "Administrator",
    status: "Active",
  },
  {
    name: "Sarah Jenkins",
    email: "s.jenkins@thecoldplace.com",
    role: "Manager",
    status: "Active",
  },
  {
    name: "Michael Chen",
    email: "m.chen@thecoldplace.com",
    role: "Staff",
    status: "Active",
  },
  {
    name: "Emma Watson",
    email: "emma.w@thecoldplace.com",
    role: "Technician",
    status: "Inactive",
  },
  {
    name: "David Smith",
    email: "d.smith@thecoldplace.com",
    role: "Staff",
    status: "Active",
  },
];

const locations = [
  {
    name: "The Cold Place — Main",
    address: "Lagos, Nigeria",
    status: "Active",
  },
  {
    name: "The Cold Place — Ikeja",
    address: "Ikeja, Nigeria",
    status: "Active",
  },
  {
    name: "The Cold Place — Lekki",
    address: "Lekki, Nigeria",
    status: "Inactive",
  },
];

export default function Settings() {
  const [tab, setTab] = useState<"Users & Roles" | "Locations">(
    "Users & Roles",
  );
  const [query, setQuery] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email} ${user.role} ${user.status}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );
  const filteredLocations = useMemo(
    () =>
      locations.filter((location) =>
        `${location.name} ${location.address} ${location.status}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  //FIXME: This might be useful in the future.
  // function exportData() {
  //   const rows = tab === "Users & Roles" ? users : locations;
  //   const csv = [
  //     Object.keys(rows[0]).join(","),
  //     ...rows.map((row) => Object.values(row).join(",")),
  //   ].join("\n");
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  //   link.download = `${tab.toLowerCase().replaceAll(" ", "-")}.csv`;
  //   link.click();
  //   URL.revokeObjectURL(link.href);
  // }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-700 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-teal-950">Settings</h1>
            <p className="mt-1 text-xs text-slate-500">
              All admin settings are handled at this point.
            </p>
          </div>
          <div className="flex gap-2 self-start">
            {/* <button onClick={exportData} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 15v4h14v-4" /></svg>
              Export
            </button> */}
            {tab === "Users & Roles" ? (
              <button
                onClick={() => setShowAddUser(true)}
                className="inline-flex items-center gap-2 rounded-md bg-teal-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3.5 19v-1a5.5 5.5 0 0 1 11 0v1M19 8v6m-3-3h6" />
                </svg>
                <span>Add User</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddUser(true)}
                className="inline-flex items-center gap-2 rounded-md bg-teal-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3.5 19v-1a5.5 5.5 0 0 1 11 0v1M19 8v6m-3-3h6" />
                </svg>
                <span>Add Location</span>
              </button>
            )}
          </div>
        </header>

        <section className="mt-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex border-b border-slate-200"
              role="tablist"
              aria-label="Settings sections"
            >
              {(["Users & Roles", "Locations"] as const).map((label) => (
                <button
                  key={label}
                  role="tab"
                  aria-selected={tab === label}
                  onClick={() => {
                    setTab(label);
                    setQuery("");
                  }}
                  className={`-mb-px border-b-2 px-1 pb-2.5 pt-1 text-xs font-semibold transition-colors ${tab === label ? "border-teal-900 text-teal-950" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  <span className="px-1">{label}</span>
                </button>
              ))}
            </div>
            <label className="flex h-9 w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 text-slate-400 shadow-sm sm:w-48">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="10.8" cy="10.8" r="6.3" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                aria-label={`Search ${tab.toLowerCase()}`}
              />
            </label>
          </div>

          <div className="mt-3 overflow-visible rounded-lg border border-slate-200/80 bg-white shadow-sm">
            {tab === "Users & Roles" ? (
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full min-w-[680px] text-left">
                  <thead className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3.5 sm:px-5">Name</th>
                      <th className="px-4 py-3.5 sm:px-5">Email</th>
                      <th className="px-4 py-3.5 sm:px-5">Role</th>
                      <th className="px-4 py-3.5 sm:px-5">Status</th>
                      <th className="w-12 px-3 py-3.5" aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {filteredUsers.map((user) => (
                      <tr key={user.email} className="hover:bg-slate-50/70">
                        <td className="whitespace-nowrap px-4 py-3.5 font-medium text-teal-950 sm:px-5">
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 sm:px-5">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 sm:px-5">
                          {user.role}
                        </td>
                        <td className="px-4 py-3.5 sm:px-5">
                          <span
                            className={`inline-flex rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase ${user.status === "Active" ? "border-teal-200 bg-teal-50 text-teal-700" : "border-slate-200 bg-slate-100 text-slate-600"}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="relative px-3 py-2 text-center">
                          <button
                            onClick={() =>
                              setMenu(menu === user.email ? null : user.email)
                            }
                            aria-label={`Actions for ${user.name}`}
                            aria-expanded={menu === user.email}
                            className="rounded p-1 text-slate-600 hover:bg-slate-100"
                          >
                            ⋮
                          </button>
                          {menu === user.email && (
                            <div className="absolute right-7 top-8 z-10 w-32 rounded-md border border-slate-200 bg-white py-1 text-left shadow-lg">
                              <button
                                onClick={() => setMenu(null)}
                                className="block w-full px-3 py-2 text-xs hover:bg-slate-50"
                              >
                                Edit user
                              </button>
                              <button
                                onClick={() => setMenu(null)}
                                className="block w-full px-3 py-2 text-xs hover:bg-slate-50"
                              >
                                Manage access
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-8 text-center text-xs text-slate-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full min-w-[520px] text-left">
                  <thead className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5">Location</th>
                      <th className="px-5 py-3.5">Address</th>
                      <th className="px-5 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {filteredLocations.map((location) => (
                      <tr key={location.name} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5 font-medium text-teal-950">
                          {location.name}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {location.address}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase ${location.status === "Active" ? "border-teal-200 bg-teal-50 text-teal-700" : "border-slate-200 bg-slate-100 text-slate-600"}`}
                          >
                            {location.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredLocations.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-5 py-8 text-center text-xs text-slate-500"
                        >
                          No locations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {showAddUser && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowAddUser(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-title"
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h2
                id="add-user-title"
                className="text-base font-semibold text-teal-950"
              >
                Add User
              </h2>
              <button
                onClick={() => setShowAddUser(false)}
                aria-label="Close"
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setShowAddUser(false);
              }}
            >
              <label className="block text-xs font-medium text-slate-700">
                Full name
                <input
                  required
                  className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                  placeholder="Enter full name"
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Email address
                <input
                  required
                  type="email"
                  className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                  placeholder="name@example.com"
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Role
                <select className="mt-1.5 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700">
                  <option>Staff</option>
                  <option>Administrator</option>
                  <option>Manager</option>
                  <option>Technician</option>
                </select>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-teal-900 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-800"
                >
                  Add user
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
