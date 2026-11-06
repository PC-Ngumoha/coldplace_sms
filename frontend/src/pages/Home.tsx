import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ROLES } from "@/lib/definitions";
import { clsx } from "cn";

import {
  ArrowRight,
  ChartNoAxesColumn,
  ChevronDown,
  Grid2X2,
  Package,
  ShoppingCart,
  Settings,
  Tag,
  Thermometer,
  TriangleAlert,
  Truck,
  UserRound,
  LogOut,
  Sidebar,
  SidebarClose,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { useAuth } from "@/contexts/auth_context";
import { type RoleName } from "@/lib/definitions";
import type { Location } from "@/types";
import { locationApi } from "@/services/Locationapi";

import { useEffect, useState } from "react";

const navigation = [
  { label: "Dashboard", to: "/", icon: Grid2X2 },
  { label: "Products", to: "/products", icon: Package },
  { label: "Receiving", to: "/receiving", icon: Truck },
  { label: "Transfers", to: "/transfers", icon: ArrowRight },
  { label: "Sales", to: "/sales", icon: ShoppingCart },
  { label: "Damage & loss", to: "/damage", icon: TriangleAlert },
  { label: "Pricing", to: "/pricing", icon: Tag },
  { label: "Reports", to: "/reports", icon: ChartNoAxesColumn },
];

export default function Home() {
  const location = useLocation();
  const { logout, user: currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>();
  const [selectedLocation, setSelectedLocation] = useState(0);
  const userRole = currentUser?.role as RoleName;

  const openSidebar = () => {
    setOpen(true);
  };

  const closeSidebar = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchLocations() {
      const data = await locationApi.list();
      setLocations(data);
      setSelectedLocation(data.length > 0 ? data[0].id : 0); // select the first location you can find
    }

    fetchLocations();
  }, []);

  return (
    <div className="flex h-screen bg-[#edf3f2] text-slate-800 relative">
      {/* Sidebar */}
      <aside
        className={clsx(
          "w-full h-full md:w-fit bg-slate-950/50 fixed md:relative z-20",
          open ? "flex" : "hidden md:flex",
        )}
        onClick={() => {
          closeSidebar();
        }}
      >
        <div
          className="h-full w-65 flex shrink-0 flex-col justify-between border-r,
          border-[#c9c6d8] bg-[#f7f7fa] px-4 py-4 shadow-[inset_-1px_0_0_rgba(115,120,149,0.18)]"
          onClick={(evt) => {
            evt.stopPropagation();
          }}
        >
          <div>
            <div className="md:hidden flex justify-end">
              <button onClick={closeSidebar}>
                <SidebarClose />
              </button>
            </div>
            <div>
              <div className="mb-6 flex items-center gap-3 px-2 pt-1">
                <div className="flex size-10 items-center justify-center rounded-lg bg-darker-teal-blue text-white shadow-sm">
                  <Thermometer className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[17px] font-semibold tracking-tight text-slate-800">
                    The Cold Place
                  </div>
                  <div className="text-[12px] leading-4 text-slate-500">
                    Cold room storage
                    <br />
                    management
                  </div>
                </div>
              </div>

              <nav className="space-y-1.5">
                {navigation.map(({ label, to, icon: Icon }) => {
                  const active = location.pathname === to;

                  return (
                    <Link
                      key={label}
                      to={to}
                      className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-colors ${
                        active
                          ? "bg-darker-teal-blue text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-800"
                      }`}
                    >
                      <Icon className="size-4.5" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <p className="px-2 text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
              Working location
            </p>
            {locations && (
              <div className="space-y-1.5">
                {locations.map((location) => (
                  <Button
                    key={location.id}
                    variant="ghost"
                    className={`h-9 w-full justify-start rounded-lg px-3 text-[15px] font-normal ${
                      selectedLocation === location.id
                        ? "border border-[#6ca2a8] bg-[#e7f3f4] text-slate-800"
                        : "text-slate-600 hover:bg-slate-200/70"
                    }`}
                    onClick={() => setSelectedLocation(location.id)}
                  >
                    {location.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Navbar */}
        <header className="flex h-18 shrink-0 items-center justify-end border-b border-[#d7dbe1] bg-[#f8f9fa] px-5">
          <nav className="w-full flex justify-between md:justify-end">
            <button className="md:hidden" onClick={openSidebar}>
              <Sidebar />
            </button>
            <div className="flex items-center gap-3">
              <div
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 
                text-sm font-medium text-slate-700 shadow-sm"
              >
                <div
                  className="flex size-5 items-center justify-center rounded-full border border-slate-300 
                bg-slate-50 text-slate-500"
                >
                  <UserRound className="size-3.5" />
                </div>
                {ROLES[userRole].display}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2
                      text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                    >
                      {currentUser?.name ?? "User"}
                      <ChevronDown className="size-4 text-slate-500" />
                    </button>
                  }
                />
                <DropdownMenuContent className="w-75">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>User Information</DropdownMenuLabel>
                    <div className="mx-2 text-xs leading-4 flex flex-col justify-center">
                      <p className="flex items-center gap-2  my-2">
                        Full Name:{" "}
                        <span className="tracking-wider font-semibold">
                          {currentUser?.name ?? "Random User"}
                        </span>
                      </p>

                      <p className="flex items-center gap-2 text-xs leading-4 my-2">
                        Email:{" "}
                        <span className="tracking-wider">
                          {currentUser?.email ?? "user@coldplace.com"}
                        </span>
                      </p>

                      <p className="flex items-center gap-2 text-xs leading-4 my-2">
                        Role:{" "}
                        <span
                          className={`tracking-wider bg-lighter-teal-blue p-1 rounded-2xl ${ROLES[userRole].color}`}
                        >
                          {ROLES[userRole].display}
                        </span>
                      </p>
                    </div>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="my-1">
                      <Settings />
                      <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                      }}
                      className="my-1"
                    >
                      <LogOut />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </header>

        <main className="h-screen overflow-auto p-2">
          <Outlet />
        </main>

        <Toaster />
      </div>
    </div>
  );
}
