import type { RoleName } from "@/lib/definitions";

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
