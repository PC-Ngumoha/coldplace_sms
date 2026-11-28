import type { RoleName } from "@/lib/definitions";

// USERS & AUTHENTICATION

export interface User {
  id: number;
  email: string;
  is_primary_handler: number;
  must_change_password: number;
  name: string;
  role: RoleName;
  status: "active" | "inactive";
  permissions: string[];
  location_id: number | null;
}

export interface UpdatePassword {
  password?: string;
  old_password?: string;
  new_password?: string;
}

export interface CreateUser {
  email: string;
  password: string;
  name: string;
  role: RoleName;
  location_id?: number;
}

export type EditUser = Omit<CreateUser, "password">;

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// LOCATION MANAGEMENT

export interface Location {
  id: number;
  name: string;
  address: string | null;
  is_central: number;
  status: "active" | "inactive";
}

export interface ModifyLocation {
  name: string;
  address: string | null;
}

// SUPPLIER MANAGEMENT

export interface Supplier {
  id: number;
  name: string;
  contact: string | null;
  notes: string | null;
  outlet_allowed: boolean;
  status: "active" | "inactive";
  created_by: number;
  created_at: number;
}

export interface ModifySupplier {
  name: string;
  contact: string | null;
  notes: string | null;
  outlet_allowed: boolean;
}

// CATEGORIES

export interface Category {
  id: number;
  name: string;
  status: string;
  created_by: number;
  created_at: number;
}

export interface ModifyCategory {
  name: string;
}

// UNITS & PRODUCTS

export interface Unit {
  id: number;
  code: string;
  name: string;
  is_base: boolean | number;
  status: "active" | "inactive";
}

export interface ProductUnit {
  unit_id: number;
  code: string;
  name: string;
  kg_per_unit: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category_id: number | null;
  category_name: string | null;
  description: string | null;
  min_stock_kg: string;
  status: "active" | "inactive";
  units: ProductUnit[];
}

export interface CreateProduct {
  sku: string;
  name: string;
  category_id: number | null;
  description?: string;
  min_stock_kg?: string;
  kg_per_carton?: string;
}

export type UpdateProduct = Omit<CreateProduct, "sku">;

// RECEIPTS / RECEIVING

export interface Received {
  id: number;
  reference: string;
  supplier_id: number;
  supplier_name: string;
  location_id: number;
  location_name: string;
  receipt_date: string;
  delivery_ref: string | null;
  notes: string | null;
  created_by_name: string;
  created_at: string;
  total_value: string;
}

export interface ReceivedLine {
  id: number;
  product_id: number;
  sku: string;
  product_name: string;
  unit_id: number;
  unit_code: string;
  delivered_qty: string;
  damaged_qty: string;
  accepted_kg: string;
  damaged_kg: string;
  damage_reason: string | null;
  unit_cost: string;
  line_value: string;
}

export type ReceivedDetails = Received & {
  lines: ReceivedLine[];
};

export interface CreateReceived {
  supplier_id: number;
  location_id: number;
  delivery_ref?: string;
  notes?: string;
  lines: CreateReceivedLines[];
}

export interface CreateReceivedLines {
  product_id: number;
  unit_id: number;
  delivered_qty: string;
  damaged_qty?: string | null;
  damage_reason?: string | null;
  unit_cost: string;
}

// INVENTORY
export interface InventoryBalance {
  product_id: number;
  sku: string;
  product_name: string;
  location_id: number;
  location_name: string;
  balance_kg: string;
  balance_cartons: string | null;
  last_movement_at: string;
}

export interface LedgerItem {
  id: number;
  movement_type: string;
  quantity_kg: string;
  balance_after: string;
  movement_date: string;
  source_table: string;
  source_id: string;
  reason: string | null;
  created_by_name: string;
  created_at: string;
}

export interface LedgerResponse {
  product: {
    id: number;
    sku: string;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
  balance_kg: string;
  balance_cartons: string | null;
  items: LedgerItem[];
}

// Prices
export interface PriceUnit {
  unit_id: number;
  unit_code: string;
  kg_per_unit: string;
  price: string | null;
  derived_price: string | null;
  effective_from: string | null;
  set_by_name: string | null;
}

export interface ProductPrice {
  product_id: number;
  sku: string;
  product_name: string;
  units: PriceUnit[];
}

export interface PriceHistoryItem {
  id: number;
  unit_id: number;
  unit_code: string;
  price: string;
  effective_from: string;
  effective_to: string | null;
  set_by_name: string;
}

export interface SetPrice {
  product_id: number;
  unit_id: number;
  price: string;
}

export interface SetPriceResult {
  id: number;
  status: "created" | "changed" | "unchanged";
}

// CUSTOMERS & SALES & DAY CLOSING / REOPENING
export type DayState = "open" | "closed" | "locked" | "future";

export interface DayWindow {
  earliest: string;
  latest: string;
} // "2026-11-23"

export interface DayStatus {
  location_id: number;
  date: string;
  state: DayState;
  was_reopened: boolean;
  closed_by_name: string | null;
  closed_at: string | null; // ISO 8601
  reopened_by_name: string | null;
  reopened_at: string | null; // ISO 8601
  can_record: boolean;
  can_close: boolean;
  can_reopen: boolean;
  day_total: string; // money string
  window: DayWindow;
}

export interface DayRecord {
  id: number;
  location_id: number;
  location_name: string;
  date: string;
  status: "closed" | "reopened";
  closed_by_name: string;
  closed_at: string;
  reopened_by_name: string | null;
  reopened_at: string | null;
}

export interface DayList {
  window: DayWindow;
  items: DayRecord[];
}

export interface CloseDayRequest {
  location_id?: number;
  date: string;
}

export interface ReopenDayRequest {
  location_id: number;
  date: string;
  reason: string;
}

export interface DayActionResult {
  status: "closed" | "reopened" | "unchanged";
  date: string;
}

export type CustomerType = "individual" | "business";
export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: number;
  name: string;
  customer_type: CustomerType;
  phone: string | null; // international form, e.g. "+2348031234567"
  address: string | null;
  status: CustomerStatus;
  created_at: string; // "2026-11-18 09:12:03" (Lagos time, no zone marker)
  sales_count: number;
  total_spent: string; // decimal string, 2 places
  average_sale: string | null; // null when sales_count is 0
  last_purchase_date: string | null; // "2026-11-23", date only
}

export interface CustomerRecentSale {
  id: number;
  reference: string;
  sale_date: string; // date only
  location_name: string;
  total: string;
}

export type CustomerDetails = Customer & {
  recent_sales: CustomerRecentSale[];
};

export interface UpdateCustomer {
  name: string; // required
  customer_type: CustomerType;
  phone?: string | null;
  address?: string | null;
}

// Used by the sales form later. Create the types now, build NO sales UI.
export interface CustomerSuggestion {
  id: number;
  name: string;
  phone: string | null;
}

export interface SaleCustomerInput {
  id?: number; // picked from suggestions
  name?: string; // required when id is absent
  phone?: string | null;
  address?: string | null;
  force_new?: boolean; // "this is a different person"
}

export interface CreateSaleLine {
  product_id: number;
  unit_id: number;
  quantity: string; // decimal string
  applied_price?: string | null; // omit to use the set price
}

export interface CreateSale {
  location_id?: number; // admin and manager only
  sale_date?: string; // "YYYY-MM-DD", today or up to 3 days earlier
  customer: SaleCustomerInput;
  lines: CreateSaleLine[];
}

export interface CreateSaleResult {
  id: number;
  reference: string;
  sale_date: string;
  customer: {
    id: number;
    name: string;
    outcome: "selected" | "matched" | "created";
  };
  total: string;
  day_total: string;
}

export interface AmbiguousCustomerError {
  error: string;
  candidates: {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
    status: CustomerStatus;
  }[];
}

export type VarianceLabel = "profit" | "loss" | "at_set_price" | "no_set_price";

export interface Sale {
  id: number;
  reference: string;
  location_id: number;
  location_name: string;
  customer_id: number;
  customer_name: string;
  sale_date: string;
  created_by_name: string;
  created_at: string;
  total: string;
  line_count: number;
  variance_total: string | null;
}

export interface SaleLine {
  id: number;
  product_id: number;
  sku: string;
  product_name: string;
  unit_id: number;
  unit_code: string;
  quantity: string;
  quantity_kg: string;
  applied_price: string;
  line_total: string;
  set_price: string | null;
  set_price_total: string | null;
  variance_amount: string | null;
  variance_percent: string | null;
  variance_label: VarianceLabel;
}
export type SaleDetails = Sale & { lines: SaleLine[] };

// UTILITIES & LOGS

export interface ProcessResponse {
  error?: string;
  message?: string;
  row_count?: number;
  last_insert_id?: number;
  reference?: string;
}

export interface Log {
  id: number;
  user_id: number;
  action: string;
  entity: string;
  entity_id: number;
  old_value: string;
  new_value: string;
  reason: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}
