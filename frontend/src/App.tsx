import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChartNoAxesColumn,
  Grid2X2,
  Package,
  ShoppingCart,
  Tag,
  Thermometer,
  TriangleAlert,
  Truck,
  Settings,
} from "lucide-react";
// import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";

const navigation = [
  { label: "Dashboard", to: "/", icon: Grid2X2 },
  { label: "Products", to: "/products", icon: Package },
  { label: "Receiving", to: "/receiving", icon: Truck },
  { label: "Transfers", to: "/transfers", icon: ArrowRight },
  { label: "Sales", to: "/sales", icon: ShoppingCart },
  { label: "Damage & loss", to: "/damage", icon: TriangleAlert },
  { label: "Pricing", to: "/pricing", icon: Tag },
  { label: "Reports", to: "/reports", icon: ChartNoAxesColumn },
  { label: "Settings", to: "/settings", icon: Settings },
];

const locations = [
  { name: "Central", active: true },
  { name: "Gwarimpa", active: false },
  { name: "Mpape", active: false },
];

export default function App() {
  const location = useLocation();

  return (
    <div
      className="flex  h-screen retro-mobile:h-fit flex-col overflow-auto border border-slate-200 
      bg-lightest-teal-blue text-slate-900"
    >
      <header
        className="flex flex-col md:flex-row md:h-[73px] gap-3 md:gap-0 shrink-0 items-center justify-between 
      bg-darkest-teal-blue px-5 py-4 md:pb-0 text-white"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white text-teal-blue">
            <Thermometer className="size-6" />
          </div>
          <div>
            <div className="font-semibold leading-3 md:leading-5">
              The Cold Place
            </div>
            <div className="text-xs text-cyan-100">
              Cold room storage management
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-[12px] md:text-[16px] tracking-wider md:tracking-normal ">
          <span
            className="inline-flex h-11 items-center rounded-md border border-teal-blue bg-darker-teal-blue px-4
           font-medium text-white"
          >
            Administrator
          </span>
          {/* TODO: Modify this to enable me logout by clicking this Button */}
          <span
            className="inline-flex h-11 items-center rounded-md border border-teal-blue bg-darker-teal-blue text-white
            hover:bg-teal-blue hover:text-white px-4"
          >
            Abdulbasit
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside
          className=" w-[60px] md:w-[190px] lg:w-[238px] shrink-0 flex-col justify-between items-center border-r 
        border-slate-200 bg-gray-50 p-4 md:flex"
        >
          <nav className="space-y-1">
            {navigation.map(({ label, to, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={label}
                  to={to}
                  className={`flex flex-col md:flex-row h-11 items-center justify-center md:justify-start 
                    gap-1 md:gap-3 rounded-xl px-4 text-[9px] md:text-[14px]
                    font-medium transition-colors ${
                      active
                        ? "text-teal-blue md:bg-teal-blue md:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  <Icon className="size-[18px]" />
                  <span className="md:inline-block">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block space-y-1">
            <p className="px-1 text-sm text-slate-400">Working location</p>
            {locations.map(({ name, active }) => (
              <Button
                key={name}
                variant="ghost"
                className={`h-9 w-full justify-start rounded-lg px-3 font-normal ${
                  active
                    ? "border border-teal-blue bg-lighter-teal-blue text-slate-900"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {name}
              </Button>
            ))}
          </div>
        </aside>

        {/* Main page content displayed here */}
        <main className="min-w-0 flex-1 overflow-auto p-5 pb-20 md:pb-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
