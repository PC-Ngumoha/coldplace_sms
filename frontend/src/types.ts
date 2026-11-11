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

export interface ProcessResponse {
  error?: string;
  message?: string;
  row_count?: number;
  last_insert_id?: number;
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
