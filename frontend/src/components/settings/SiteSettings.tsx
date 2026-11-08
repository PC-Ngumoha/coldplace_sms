import { useMemo, useState, useEffect, useCallback } from "react";
import { UserPlus, MapPinPlus, Search, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { userApi } from "@/services/Userapi";
import { locationApi } from "@/services/Locationapi";
import { showSuccess, showError } from "@/services/toasts";
import { useAuth } from "@/contexts/auth_context";
import type { User, Location } from "@/types";
import { isAxiosError } from "axios";
import { useNavigate, useLocation } from "react-router";

export default function SiteSettings() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [tab, setTab] = useState<"users & roles" | "locations">(
    "users & roles",
  );
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUsers = useCallback(async () => {
    const availableUsers = await userApi.list();

    // Filter out current user from list of users
    const displayedUsers = availableUsers.filter(
      (user) => user.id !== currentUser?.id,
    );

    setUsers(displayedUsers);
  }, [currentUser?.id]);

  const fetchLocations = useCallback(async () => {
    const result = await locationApi.list();
    setLocations(result);
  }, []);

  useEffect(() => {
    async function fetchData() {
      fetchUsers();
      fetchLocations();
    }

    fetchData();
  }, [location, fetchUsers, fetchLocations]);

  const openAddUserForm = () => {
    navigate("/add/users", {
      state: { background: location },
    });
  };

  const openAddLocationForm = () => {
    navigate("/add/locations", {
      state: { background: location },
    });
  };

  const openEditUserForm = (id: number) => {
    navigate(`/edit/users/${id}`, {
      state: { background: location },
    });
  };

  const openChangePasswordForm = (id: number) => {
    navigate(`/edit/users/${id}/changePassword`, {
      state: { background: location },
    });
  };

  const openEditLocationForm = (id: number) => {
    navigate(`/edit/locations/${id}`, {
      state: { background: location },
    });
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email} ${user.role} ${user.status}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, users],
  );
  const filteredLocations = useMemo(
    () =>
      locations.filter((location) =>
        `${location.name} ${location.address} ${location.status}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, locations],
  );

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-7 text-teal-950">
            Site Settings
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            General site-wide settings & configurations
          </p>
        </div>
        <div className="flex gap-2 self-start">
          {tab === "users & roles" ? (
            <button
              onClick={() => openAddUserForm()}
              className="inline-flex items-center gap-2 rounded-md bg-teal-blue px-3 py-2 text-sm
                font-semibold text-white shadow-sm hover:bg-darker-teal-blue"
            >
              <UserPlus size={18} />
              <span>Add User</span>
            </button>
          ) : (
            <button
              onClick={() => openAddLocationForm()}
              className="inline-flex items-center gap-2 rounded-md bg-teal-blue px-3 py-2 text-sm font-semibold 
                text-white shadow-sm hover:bg-darker-teal-blue"
            >
              <MapPinPlus size={18} />
              <span>Add Location</span>
            </button>
          )}
        </div>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="mt-5">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="flex border-b border-slate-200 bg-white z-0 p-3">
            <TabsTrigger
              value="users & roles"
              className="py-3 px-4 mr-2 data-active:bg-lighter-teal-blue data-active:text-teal-blue
                hover:text-teal-blue"
            >
              Users & Roles
            </TabsTrigger>
            <TabsTrigger
              value="locations"
              className="py-3 px-4 mr-2 data-active:bg-lighter-teal-blue data-active:text-teal-blue
                hover:text-teal-blue"
            >
              Locations
            </TabsTrigger>
          </TabsList>

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
          <TabsContent value="users & roles">
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full min-w-170 table-fixed text-left">
                <thead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3.5 sm:px-5">Name</th>
                    <th className="px-4 py-3.5 sm:px-5">Email</th>
                    <th className="px-4 py-3.5 sm:px-5">Role</th>
                    <th className="px-4 py-3.5 sm:px-5">Status</th>
                    <th className="w-12 px-3 py-3.5" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
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
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <button className="rounded p-1 text-slate-600 hover:bg-slate-100">
                                <EllipsisVertical size={16} />
                              </button>
                            }
                          />
                          <DropdownMenuContent className="w-50">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => openEditUserForm(user.id)}
                              >
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => openChangePasswordForm(user.id)}
                              >
                                Change Password
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              {user.status.toLocaleLowerCase() === "active" ? (
                                <DropdownMenuItem
                                  onClick={async () => {
                                    try {
                                      await userApi.deactivate(user.id);
                                      showSuccess(
                                        "User deactivated successfully",
                                      );
                                      await fetchUsers();
                                    } catch (err) {
                                      showError(
                                        isAxiosError(err)
                                          ? err.response?.data.error
                                          : "Oops! please try again later",
                                      );
                                    }
                                  }}
                                >
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={async () => {
                                    try {
                                      await userApi.activate(user.id);
                                      showSuccess(
                                        "User activated successfully",
                                      );
                                      await fetchUsers();
                                    } catch (err) {
                                      showError(
                                        isAxiosError(err)
                                          ? err.response?.data.error
                                          : "Oops! please try again later",
                                      );
                                    }
                                  }}
                                >
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          </TabsContent>
          <TabsContent value="locations">
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full min-w-130 table-fixed text-left">
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
                      <td className="px-5 py-3.5 text-slate-600 text-wrap">
                        {location.address ?? "_______"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase 
                              ${
                                location.status === "active"
                                  ? "border-teal-200 bg-teal-50 text-teal-700"
                                  : "border-slate-200 bg-slate-100 text-slate-600"
                              }`}
                        >
                          {location.status}
                        </span>
                      </td>
                      <td className="relative px-3 py-2 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <button className="rounded p-1 text-slate-600 hover:bg-slate-100">
                                <EllipsisVertical size={16} />
                              </button>
                            }
                          />
                          <DropdownMenuContent>
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() =>
                                  openEditLocationForm(location.id)
                                }
                              >
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              {location.status.toLocaleLowerCase() ===
                              "active" ? (
                                <DropdownMenuItem
                                  onClick={async () => {
                                    try {
                                      await locationApi.deactivate(location.id);
                                      showSuccess(
                                        "Location deactivated successfully",
                                      );
                                      await fetchLocations();
                                    } catch (err) {
                                      showError(
                                        isAxiosError(err)
                                          ? err.response?.data.error
                                          : "Oops! please try again later",
                                      );
                                    }
                                  }}
                                >
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={async () => {
                                    try {
                                      await locationApi.activate(location.id);
                                      showSuccess(
                                        "Location activated successfully",
                                      );
                                      await fetchLocations();
                                    } catch (err) {
                                      showError(
                                        isAxiosError(err)
                                          ? err.response?.data.error
                                          : "Oops! please try again later",
                                      );
                                    }
                                  }}
                                >
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
