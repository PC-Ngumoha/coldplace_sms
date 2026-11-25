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
import { Can } from "@/components/permissions";
import { ROLES, type RoleName } from "@/lib/definitions";
import { clsx } from "cn";

import {
  ArrowRight,
  ChartNoAxesColumn,
  ChevronDown,
  Grid2X2,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Tag,
  // Thermometer,
  TriangleAlert,
  Truck,
  UserRound,
  LogOut,
  Warehouse,
  ListClock,
  Sidebar,
  SidebarClose,
  ClipboardPenLine,
  UserCircle2,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/contexts/auth_context";
import type { Location } from "@/types";
import { locationApi } from "@/services/Locationapi";

import { useEffect, useState } from "react";

const navigation = [
  { label: "Dashboard", to: "/", icon: Grid2X2, permission: "users:profile" },
  {
    label: "Products",
    to: "/products",
    icon: Package,
    permission: "products:list",
  },
  {
    label: "Inventory",
    to: "/inventory",
    icon: Warehouse,
    permission: "inventory:view",
  },
  {
    label: "Receiving",
    to: "/received",
    icon: Truck,
    permission: "receipts:list",
  },
  {
    label: "Transfers",
    to: "/transfers",
    icon: ArrowRight,
    permission: "users:profile",
  },
  {
    label: "Sales",
    to: "/sales",
    icon: ShoppingCart,
    permission: "users:profile",
  },
  {
    label: "Damage & loss",
    to: "/damage",
    icon: TriangleAlert,
    permission: "users:profile",
  },
  { label: "Pricing", to: "/pricing", icon: Tag, permission: "prices:list" },
  {
    label: "Reports",
    to: "/reports",
    icon: ChartNoAxesColumn,
    permission: "users:profile",
  },
  {
    label: "Audit Logs",
    to: "/logs",
    icon: ListClock,
    permission: "audit:view",
  },
  {
    label: "Adjustments",
    to: "/adjustments",
    icon: ClipboardPenLine,
    permission: "users:profile",
  },
  {
    label: "Suppliers",
    to: "/suppliers",
    icon: Package,
    permission: "suppliers:view",
  },
  {
    label: "Customers",
    to: "/customers",
    icon: Users,
    permission: "users:profile",
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
    permission: "settings:view",
  },
];

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const gotoProfilePage = () => navigate("/me");

  return (
    <div className="flex h-screen bg-[#edf3f2] text-slate-800 relative">
      {/* Sidebar */}
      <aside
        className={clsx(
          "w-full h-full md:w-fit bg-slate-950/50 md:relative z-20",
          open ? "flex" : "hidden md:flex",
        )}
        onClick={() => {
          closeSidebar();
        }}
      >
        <div
          className="h-full w-65 flex shrink-0 flex-col justify-between border-r,
          border-[#c9c6d8] bg-[#f7f7fa] px-4 py-4 shadow-[inset_-1px_0_0_rgba(115,120,149,0.18)]
          overflow-y-auto"
          onClick={(evt) => {
            evt.stopPropagation();
          }}
        >
          <div>
            <div>
              <div className="mb-6 flex items-center justify-between gap-3 px-2 pt-1">
                <div className="flex-2 h-20 w-auto">
                  <img
                    src="/coldplace_logo.svg"
                    alt="Cold place logo"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="md:hidden flex-1 flex justify-end items-center">
                  <button onClick={closeSidebar}>
                    <SidebarClose />
                  </button>
                </div>
              </div>

              <nav className="space-y-1.5">
                {navigation.map(({ label, to, icon: Icon, permission }) => {
                  const active = location.pathname === to;

                  return (
                    <Can key={label} permission={permission}>
                      <Link
                        to={to}
                        className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-colors ${
                          active
                            ? "bg-teal-blue text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-800"
                        }`}
                      >
                        <Icon className="size-4.5" />
                        <span>{label}</span>
                      </Link>
                    </Can>
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
        <header className="flex min-h-18 shrink-0 items-center justify-end border-b border-[#d7dbe1] bg-[#f8f9fa] px-3 py-2 sm:px-5">
          <nav className="flex w-full min-w-0 items-center justify-between md:justify-end">
            <button
              type="button"
              aria-label="Open navigation menu"
              className="shrink-0 rounded-md p-2 hover:bg-slate-100 md:hidden"
              onClick={openSidebar}
            >
              <Sidebar className="size-5" />
            </button>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div
                className="inline-flex shrink-0 items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-2 sm:px-3 
                text-sm font-medium text-slate-700 shadow-sm"
              >
                <div
                  className="flex size-5 items-center justify-center rounded-full border border-slate-300 
                bg-slate-50 text-slate-500"
                >
                  <UserRound className="size-3.5" />
                </div>
                <span className="hidden sm:inline">
                  {ROLES[userRole].display}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="inline-flex max-w-[40vw] items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-2
                      text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:max-w-56 sm:gap-2 sm:px-3"
                    >
                      <span className="truncate">
                        {currentUser?.name ?? "User"}
                      </span>
                      <ChevronDown className="size-4 shrink-0 text-slate-500" />
                    </button>
                  }
                />
                <DropdownMenuContent className="w-[min(18.75rem,calc(100vw-1.5rem))]">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>User Information</DropdownMenuLabel>
                    <div className="mx-2 flex flex-col justify-center text-xs leading-4">
                      <p className="my-2 flex flex-wrap items-center gap-2">
                        Full Name:{" "}
                        <span className="tracking-wider font-semibold">
                          {currentUser?.name ?? "Random User"}
                        </span>
                      </p>

                      <p className="my-2 flex flex-wrap items-center gap-2 text-xs leading-4">
                        Email:{" "}
                        <span className="break-all tracking-wider">
                          {currentUser?.email ?? "user@coldplace.com"}
                        </span>
                      </p>

                      <p className="my-2 flex flex-wrap items-center gap-2 text-xs leading-4">
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
                    <DropdownMenuItem
                      className="my-1"
                      onClick={gotoProfilePage}
                    >
                      <UserCircle2 />
                      Profile
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
          {/* Hide all background UI behind modal if user is still using admin issued password
          until they change it. */}
          {currentUser?.must_change_password ? null : <Outlet />}
        </main>

        <Toaster />
      </div>
    </div>
  );
}
