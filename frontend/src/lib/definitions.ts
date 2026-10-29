export const ROLES = {
  executive: {
    display: "CEO/COO",
    color: "bg-violet-100 text-violet-800",
    label:
      "shadow-violet-100 has-data-checked:border-violet-800 has-data-checked:bg-violet-200",
  },
  admin: {
    display: "Administrator",
    color: "bg-rose-100 text-rose-800",
    label:
      "shadow-rose-100 has-data-checked:border-rose-800 has-data-checked:bg-rose-200",
  },
  manager: {
    display: "Manager",
    color: "bg-blue-100 text-blue-800",
    label:
      "shadow-blue-100 has-data-checked:border-blue-800 has-data-checked:bg-blue-200",
  },
  central: {
    display: "Central Handler",
    color: "bg-teal-100 text-teal-800",
    label:
      "shadow-teal-100 has-data-checked:border-teal-800 has-data-checked:bg-teal-200",
  },
  outlet: {
    display: "Outlet Handler",
    color: "bg-amber-100 text-amber-800",
    label:
      "shadow-amber-100 has-data-checked:border-amber-800 has-data-checked:bg-amber-200",
  },
  viewer: {
    display: "Viewer",
    color: "bg-slate-100 text-slate-700",
    label:
      "shadow-slate-100 has-data-checked:border-slate-800 has-data-checked:bg-slate-200",
  },
};

export type RoleName = keyof typeof ROLES; // "executive" | "manager" | "admin" | "central" | "outlet" | "viewer"
