export interface User {
  id: number;
  email: string;
  is_primary_handler: number;
  must_change_password: 1;
  name: string;
  role: string;
  status: "active" | "inactive";
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
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

export interface ProcessResponse {
  error?: string;
  message?: string;
  row_count?: number;
}
