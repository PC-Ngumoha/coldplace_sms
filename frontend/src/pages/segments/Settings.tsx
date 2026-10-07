import { useMemo, useState } from "react";
import {
  UserPlus,
  MapPinPlus,
  X,
  Search,
  EllipsisVertical,
  Crown,
  BriefcaseBusiness,
  UserCog,
  Building2,
  Store,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const roles = [
  {
    name: "executive",
    icon: Crown,
  },
  {
    name: "manager",
    icon: BriefcaseBusiness,
  },
  {
    name: "administrator",
    icon: UserCog,
  },
  {
    name: "central",
    icon: Building2,
  },
  {
    name: "outlet",
    icon: Store,
  },
  {
    name: "viewer",
    icon: Eye,
  },
];

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
  const [showAddLocation, setShowAddLocation] = useState(false);
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

  return (
    <main className="min-h-screen px-4 py-6 text-slate-700 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-7 text-teal-950">
              Settings
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              All admin settings are handled at this point.
            </p>
          </div>
          <div className="flex gap-2 self-start">
            {tab === "Users & Roles" ? (
              <Button
                onClick={() => setShowAddUser(true)}
                className="inline-flex items-center gap-2 rounded-md bg-teal-blue px-3 py-2 text-xs
                font-semibold text-white shadow-sm hover:bg-darker-teal-blue"
              >
                <UserPlus size={18} />
                <span>Add User</span>
              </Button>
            ) : (
              <Button
                onClick={() => setShowAddLocation(true)}
                className="inline-flex items-center gap-2 rounded-md bg-teal-blue px-3 py-2 text-xs font-semibold 
                text-white shadow-sm hover:bg-darker-teal-blue"
              >
                <MapPinPlus size={18} />
                <span>Add Location</span>
              </Button>
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
                // Using a native HTML button fits the UI best.
                <button
                  key={label}
                  role="tab"
                  aria-selected={tab === label}
                  onClick={() => {
                    setTab(label);
                    setQuery("");
                  }}
                  className={`-mb-px border-b-2 px-1 pb-2.5 pt-1 text-xs font-semibold transition-colors 
                    ${
                      tab === label
                        ? "border-teal-900 text-darker-teal-blue"
                        : "border-transparent text-slate-500 hover:text-teal-blue"
                    }`}
                >
                  <span className="px-1">{label}</span>
                </button>
              ))}
            </div>
            <label
              className="flex h-9 w-full items-center gap-2 rounded-md border border-slate-200 
            bg-white px-2.5 text-slate-400 shadow-sm sm:w-48"
            >
              <Search size={18} />
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
                            className={`inline-flex rounded-md border px-1.5 py-0.5 text-[9px] 
                              font-semibold uppercase ${
                                user.status.toLowerCase() === "active"
                                  ? "border-teal-200 bg-teal-50 text-teal-700"
                                  : "border-slate-200 bg-slate-100 text-slate-600"
                              }`}
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
                            <EllipsisVertical size={16} />
                          </button>
                          {menu === user.email && (
                            <div
                              className="absolute right-7 top-8 z-10 w-32 rounded-md border border-slate-200 bg-white 
                            py-1 text-left shadow-lg"
                            >
                              <button
                                onClick={() => setMenu(null)}
                                className="block w-full px-3 py-2 text-xs hover:bg-slate-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setMenu(null)}
                                className="block w-full px-3 py-2 text-xs hover:bg-slate-50"
                              >
                                {user.status.toLowerCase() === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                              <button
                                onClick={() => setMenu(null)}
                                className="block w-full px-3 py-2 text-xs hover:bg-slate-50"
                              >
                                Delete
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
                      <th className="w-12 px-3 py-3.5" aria-label="Actions" />
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
                        <td className="relative px-3 py-2 text-center">
                          <button
                            onClick={() =>
                              setMenu(
                                menu === location.name ? null : location.name,
                              )
                            }
                            aria-label={`Actions for ${location.name}`}
                            aria-expanded={menu === location.name}
                            className="rounded p-1 text-slate-600 hover:bg-slate-100"
                          >
                            <EllipsisVertical size={16} />
                          </button>
                          {menu === location.name && (
                            <div
                              className="absolute right-7 top-8 z-10 w-32 rounded-md border border-slate-200 bg-white 
                            py-1 text-left shadow-lg"
                            >
                              <button
                                onClick={() => setMenu(null)}
                                className="block w-full px-3 py-2 text-xs hover:bg-slate-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setMenu(null)}
                                className="block w-full px-3 py-2 text-xs hover:bg-slate-50"
                              >
                                {location.status.toLowerCase() === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                              <button
                                onClick={() => setMenu(null)}
                                className="block w-full px-3 py-2 text-xs hover:bg-slate-50"
                              >
                                Delete
                              </button>
                            </div>
                          )}
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

      {/* Add user modal */}
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
                className="text-base font-semibold text-slate-900"
              >
                Add User
              </h2>
              <button
                onClick={() => setShowAddUser(false)}
                aria-label="Close"
                className="rounded p-1 text-slate-600 hover:bg-slate-100"
              >
                <X size={24} />
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
                  className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
                  placeholder="Enter full name"
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Email address
                <input
                  required
                  type="email"
                  className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
                  placeholder="name@example.com"
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Role
                <RadioGroup
                  defaultValue={roles[0].name}
                  className="my-3 grid grid-cols-2"
                >
                  {roles.map((role) => {
                    const Icon = role.icon;

                    return (
                      <Label
                        key={role.name}
                        htmlFor={role.name}
                        className="border border-lightest-teal-blue p-3 w-full flex
                    rounded-lg shadow shadow-lighter-teal-blue text-slate-600
                    has-data-checked:border-teal-blue has-data-checked:bg-lighter-teal-blue
                    has-data-checked:font-semibold capitalize"
                      >
                        <div className="w-full flex flex-col gap-3 items-center">
                          <Icon size={25} />
                          <span>{role.name}</span>
                        </div>

                        <RadioGroupItem
                          value={role.name}
                          id={role.name}
                          className="self-start data-checked:bg-slate-500"
                        />
                      </Label>
                    );
                  })}
                </RadioGroup>
              </label>
              {/* FIXME: The "Assigned location" field should only appear for
              Users with the Outlet role. */}
              <label className="block text-xs font-medium text-slate-700">
                Assigned Location
                <select
                  className="mt-1.5 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none
                focus:border-teal-blue"
                >
                  <option>Gwarinpa</option>
                  <option>Central Area</option>
                  <option>Mpape</option>
                  <option>Guzape</option>
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
                  className="rounded-md bg-teal-blue px-3 py-2 text-xs font-semibold text-white hover:bg-darker-teal-blue"
                >
                  Add user
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add location modal */}
      {showAddLocation && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowAddLocation(false);
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
                className="text-base font-semibold text-slate-900"
              >
                Add Location
              </h2>
              <button
                onClick={() => setShowAddLocation(false)}
                aria-label="Close"
                className="rounded p-1 text-slate-600 hover:bg-slate-100"
              >
                <X size={24} />
              </button>
            </div>
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setShowAddLocation(false);
              }}
            >
              <label className="block text-xs font-medium text-slate-700">
                Name
                <input
                  required
                  className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
                  placeholder="Enter location name"
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Address
                <textarea
                  required
                  className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none 
                  focus:border-teal-blue focus:ring-1 focus:ring-teal-blue"
                  placeholder="e.g No. 123 Adebayo Chika Str, Ikeja, Lagos."
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLocation(false)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-teal-blue px-3 py-2 text-xs font-semibold text-white hover:bg-darker-teal-blue"
                >
                  Add Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
