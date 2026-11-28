import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/auth_context";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Loading from "@/components/Loading";
import { formatMoney, getErrorMessage } from "@/lib/utils";
import { customerApi } from "@/services/Customerapi";
import type {
  Customer,
  CustomerDetails,
  CustomerType,
  UpdateCustomer,
} from "@/types";

type SortKey =
  | "name"
  | "phone"
  | "sales_count"
  | "total_spent"
  | "average_sale"
  | "last_purchase_date"
  | "status";
const PAGE_SIZE = 10;
const money = (value: string | null | undefined) =>
  value == null ? "—" : formatMoney(value);
const dateLabel = (value: string | null | undefined) => {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
};
const compareDecimals = (a: string | null, b: string | null) => {
  if (a == null || b == null) return a == null ? (b == null ? 0 : -1) : 1;
  const parts = (value: string) => {
    const [whole = "0", fraction = ""] = value.split(".");
    const negative = whole.startsWith("-");
    return {
      negative,
      whole: whole.replace(/^-/, "").replace(/^0+(?=\d)/, ""),
      fraction: fraction.padEnd(2, "0").slice(0, 2),
    };
  };
  const left = parts(a);
  const right = parts(b);
  if (left.negative !== right.negative) return left.negative ? -1 : 1;
  const magnitude =
    left.whole.length - right.whole.length ||
    left.whole.localeCompare(right.whole) ||
    left.fraction.localeCompare(right.fraction);
  return left.negative ? -magnitude : magnitude;
};
// const getErrorMessage = (error: unknown) => {
//   const response = (error as { response?: { data?: { error?: string } } })
//     ?.response;
//   return response?.data?.error ?? "Something went wrong. Please try again.";
// };

function TypeTag({ type }: { type: CustomerType }) {
  return (
    <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground">
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: Customer["status"] }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

export default function Customers() {
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "manager";
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("total_spent");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      setCustomers(await customerApi.list());
    } catch (err) {
      setListError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      await loadCustomers();
    }

    fetchData();
  }, [loadCustomers]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return customers
      .filter(
        (customer) =>
          (!term ||
            customer.name.toLowerCase().includes(term) ||
            (customer.phone ?? "").toLowerCase().includes(term)) &&
          (typeFilter === "all" || customer.customer_type === typeFilter) &&
          (statusFilter === "all" || customer.status === statusFilter),
      )
      .sort((a, b) => {
        let order;
        if (sortKey === "total_spent" || sortKey === "average_sale")
          order = compareDecimals(a[sortKey], b[sortKey]);
        else if (sortKey === "sales_count")
          order = a.sales_count - b.sales_count;
        else
          order = String(a[sortKey] ?? "").localeCompare(
            String(b[sortKey] ?? ""),
          );
        return order * (sortDirection === "asc" ? 1 : -1);
      });
  }, [customers, query, sortDirection, sortKey, statusFilter, typeFilter]);

  useEffect(() => {
    function resetPages() {
      setPage(1);
    }

    resetPages();
  }, [query, typeFilter, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const sortBy = (key: SortKey) => {
    if (sortKey === key)
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDirection(key === "total_spent" ? "desc" : "asc");
    }
  };
  const column = (label: string, key: SortKey, align = "") => (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${align}`}
      key={key}
    >
      <button className="min-h-11" onClick={() => sortBy(key)} type="button">
        {label}
        {sortKey === key ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
      </button>
    </th>
  );

  return (
    <main className="space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customers are added automatically when a sale is recorded
        </p>
      </header>
      <section className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            aria-label="Search customers by name or phone"
            className="h-11 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or phone"
            value={query}
          />
          <select
            aria-label="Filter by customer type"
            className="h-11 rounded-md border bg-background px-3"
            onChange={(e) => setTypeFilter(e.target.value)}
            value={typeFilter}
          >
            <option value="all">All types</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>
          <select
            aria-label="Filter by customer status"
            className="h-11 rounded-md border bg-background px-3"
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        {listError ? (
          <div className="rounded-lg border border-destructive/30 p-6 text-center">
            <p className="text-sm text-destructive">{listError}</p>
            <button
              className="mt-3 min-h-11 rounded-md border px-4 text-sm"
              onClick={() => void loadCustomers()}
              type="button"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <Loading />
        ) : customers.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No customers yet. They appear here after the first sale.
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No customers match your search.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead className="border-b text-left">
                  <tr>
                    {column("Customer", "name")}
                    {column("Phone", "phone")}
                    {column("Purchases", "sales_count", "text-right")}
                    {column("Total spent", "total_spent", "text-right")}
                    {column("Average sale", "average_sale", "text-right")}
                    {column("Last purchase", "last_purchase_date")}
                    {column("Status", "status")}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((customer) => (
                    <tr
                      aria-label={`View ${customer.name}`}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${customer.status === "inactive" ? "text-muted-foreground" : ""}`}
                      key={customer.id}
                      onClick={() => setSelectedId(customer.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {customer.name}
                        </div>
                        <div className="mt-1">
                          <TypeTag type={customer.customer_type} />
                        </div>
                      </td>
                      <td className="px-4 py-3">{customer.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {customer.sales_count}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {money(customer.total_spent)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {money(customer.average_sale)}
                      </td>
                      <td className="px-4 py-3">
                        {dateLabel(customer.last_purchase_date)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={customer.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">
                {filtered.length} customers
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="min-h-11 rounded-md border px-3 disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  type="button"
                >
                  Previous
                </button>
                <span>
                  Page {page} of {pageCount}
                </span>
                <button
                  className="min-h-11 rounded-md border px-3 disabled:opacity-50"
                  disabled={page >= pageCount}
                  onClick={() => setPage((p) => p + 1)}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      {selectedId !== null && (
        <CustomerDrawer
          canManage={canManage}
          customerId={selectedId}
          onClose={() => setSelectedId(null)}
          onSaved={loadCustomers}
        />
      )}
    </main>
  );
}

function CustomerDrawer({
  customerId,
  canManage,
  onClose,
  onSaved,
}: {
  customerId: number;
  canManage: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<CustomerType>("individual");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const details = await customerApi.retrieve(customerId);
      setCustomer(details);
      setName(details.name);
      setType(details.customer_type);
      setPhone(details.phone ?? "");
      setAddress(details.address ?? "");
    } catch {
      setLoadError("Could not load customer details.");
    } finally {
      setLoading(false);
    }
  }, [customerId]);
  useEffect(() => {
    async function fetchData() {
      await fetchDetails();
    }

    fetchData();
  }, [fetchDetails]);

  const changed =
    Boolean(customer) &&
    (name !== customer?.name ||
      type !== customer?.customer_type ||
      phone !== (customer?.phone ?? "") ||
      address !== (customer?.address ?? ""));
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customer || !changed) return;
    setSaving(true);
    setFormError("");
    const data: UpdateCustomer = {
      name: name.trim(),
      customer_type: type,
      phone: phone.trim() || null,
      address: address.trim() || null,
    };
    try {
      await customerApi.update(customer.id, data);
      await Promise.all([fetchDetails(), onSaved()]);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };
  const changeStatus = async () => {
    if (!customer) return;
    if (
      customer.status === "active" &&
      !window.confirm(`Deactivate ${customer.name}?`)
    )
      return;
    setSaving(true);
    setFormError("");
    try {
      if (customer.status === "active")
        await customerApi.deactivate(customer.id);
      else await customerApi.activate(customer.id);
      await Promise.all([fetchDetails(), onSaved()]);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-md border bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring";
  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent className="ml-auto h-full w-full max-w-[480px] rounded-none">
        <DrawerHeader className="border-b px-5 py-5 text-left">
          {customer ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <DrawerTitle className="text-xl">{customer.name}</DrawerTitle>
                <TypeTag type={customer.customer_type} />
                <StatusBadge status={customer.status} />
              </div>
              <DrawerDescription>
                Customer details and recent purchase activity
              </DrawerDescription>
            </>
          ) : (
            <DrawerTitle>Customer details</DrawerTitle>
          )}
        </DrawerHeader>
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
          {loading ? (
            <Loading />
          ) : loadError ? (
            <div className="text-sm text-destructive" role="alert">
              {loadError}
              <button
                className="ml-3 min-h-11 rounded border px-3 text-foreground"
                onClick={() => void fetchDetails()}
                type="button"
              >
                Retry
              </button>
            </div>
          ) : (
            customer && (
              <>
                <section className="grid grid-cols-2 gap-3">
                  <Summary
                    label="Total spent"
                    value={money(customer.total_spent) ?? "-"}
                  />
                  <Summary
                    label="Purchases"
                    value={String(customer.sales_count)}
                  />
                  <Summary
                    label="Average sale"
                    value={money(customer.average_sale) ?? "-"}
                  />
                  <Summary
                    label="Last purchase"
                    value={dateLabel(customer.last_purchase_date)}
                  />
                </section>
                {canManage ? (
                  <form className="space-y-3" onSubmit={save}>
                    <h3 className="font-semibold">Customer information</h3>
                    <Field label="Name">
                      <input
                        className={inputClass}
                        required
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                      />
                    </Field>
                    <Field label="Type">
                      <select
                        className={inputClass}
                        onChange={(e) =>
                          setType(e.target.value as CustomerType)
                        }
                        value={type}
                      >
                        <option value="individual">Individual</option>
                        <option value="business">Business</option>
                      </select>
                    </Field>
                    <Field label="Phone">
                      <input
                        className={inputClass}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        value={phone}
                      />
                      <span className="text-xs font-normal text-muted-foreground">
                        Local numbers like 0803... are accepted.
                      </span>
                    </Field>
                    <Field label="Address">
                      <textarea
                        className={`${inputClass} min-h-20 py-2`}
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                      />
                    </Field>
                    {formError && (
                      <p className="text-sm text-destructive" role="alert">
                        {formError}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        className="min-h-11 flex-1 rounded-md bg-primary px-4 font-medium text-primary-foreground disabled:opacity-50"
                        disabled={!changed || saving || !name.trim()}
                        type="submit"
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>
                      <button
                        className="min-h-11 flex-1 rounded-md border px-3 font-medium disabled:opacity-50"
                        disabled={saving}
                        onClick={() => void changeStatus()}
                        type="button"
                      >
                        {customer.status === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <section className="space-y-3">
                    <h3 className="font-semibold">Customer information</h3>
                    <ReadOnly label="Name" value={customer.name} />
                    <ReadOnly label="Type" value={customer.customer_type} />
                    <ReadOnly label="Phone" value={customer.phone ?? "—"} />
                    <ReadOnly label="Address" value={customer.address ?? "—"} />
                  </section>
                )}
                <section className="space-y-3">
                  <h3 className="font-semibold">Recent sales</h3>
                  {customer.recent_sales.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No recent sales.
                    </p>
                  ) : (
                    customer.recent_sales.map((sale) => (
                      <article className="rounded-lg border p-3" key={sale.id}>
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-medium">{sale.reference}</span>
                          <span className="text-right font-medium tabular-nums">
                            {money(sale.total)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {dateLabel(sale.sale_date)} · {sale.location_name}
                        </p>
                      </article>
                    ))
                  )}
                </section>
              </>
            )
          )}
        </div>
        <DrawerFooter className="border-t p-4">
          <DrawerClose className="min-h-11 rounded-md border px-4 font-medium">
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold tabular-nums">{value}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}
