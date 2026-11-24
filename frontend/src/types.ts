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
