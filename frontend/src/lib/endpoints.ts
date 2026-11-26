export const AUTH_PATHS = {
  login: () => "/api/auth/login",
  refresh: () => "/api/auth/refresh",
  logout: () => "/api/auth/logout",
  me: () => "/api/me",
};

export const USER_PATHS = {
  list: () => "/api/users",
  retrieve: (id: number) => `/api/users/${id}`,
  create: () => "/api/users",
  update: (id: number) => `/api/users/${id}`,
  deactivate: (id: number) => `/api/users/${id}/deactivate`,
  activate: (id: number) => `/api/users/${id}/activate`,
  resetPassword: (id: number) => `/api/users/${id}/changePassword`,
  changePassword: () => "/api/me/changePassword",
};

export const LOCATION_PATHS = {
  list: () => "/api/locations",
  retrieve: (id: number) => `/api/locations/${id}`,
  create: () => "/api/locations",
  update: (id: number) => `/api/locations/${id}`,
  deactivate: (id: number) => `/api/locations/${id}/deactivate`,
  activate: (id: number) => `/api/locations/${id}/activate`,
};

export const LOG_PATHS = {
  list: () => "/api/audit/logs",
};

export const CATEGORY_PATHS = {
  list: () => "/api/categories",
  create: () => "/api/categories",
  update: (id: number) => `/api/categories/${id}`,
  activate: (id: number) => `/api/categories/${id}/activate`,
  deactivate: (id: number) => `/api/categories/${id}/deactivate`,
};

export const PRODUCT_PATHS = {
  list: () => "/api/products",
  retrieve: (id: number) => `/api/products/${id}`,
  create: () => "/api/products",
  activate: (id: number) => `/api/products/${id}/activate`,
  deactivate: (id: number) => `/api/products/${id}/deactivate`,
  update: (id: number) => `/api/products/${id}`,
};

export const SUPPLIER_PATHS = {
  list: () => "/api/suppliers",
  retrieve: (id: number) => `/api/suppliers/${id}`,
  create: () => "/api/suppliers",
  activate: (id: number) => `/api/suppliers/${id}/activate`,
  deactivate: (id: number) => `/api/suppliers/${id}/deactivate`,
  update: (id: number) => `/api/suppliers/${id}`,
};

export const UNIT_PATHS = {
  list: () => "/api/units",
};

export const RECEIVED_PATHS = {
  list: () => "/api/received",
  retrieve: (id: number) => `/api/received/${id}`,
  create: () => "/api/received",
};

export const INVENTORY_PATHS = {
  balances: () => "/api/inventory",
  ledger: (productId: number, locationId: number) =>
    `/api/inventory/ledger?product_id=${productId}&location_id=${locationId}`,
};

export const PRICES_PATHS = {
  current: () => "/api/prices",
  history: (productId: number, unitId?: number) =>
    unitId
      ? `/api/prices/history?product_id=${productId}&unit_id=${unitId}`
      : `/api/prices/history?product_id=${productId}`,
  set: () => "/api/prices",
};

export const CUSTOMERS_PATHS = {
  list: () => "/customers",
  retrieve: (customerId: number) => `/customers/${customerId}`,
  search: (q: string) => `/customers/search?q=${q}`,
  update: (customerId: number) => `/customers/${customerId}`,
  activate: (customerId: number) => `/customers/${customerId}/activate`,
  deactivate: (customerId: number) => `/customers/${customerId}/deactivate`,
};

export const SALES_PATHS = {
  list: (from: string, to: string) => `/sales?from=${from}&to=${to}`,
  retrieve: (saleId: number) => `/sales/${saleId}`,
  create: () => `/sales`,
};

export const DAY_PATHS = {
  status: (locationId: number, date: string) =>
    `/days/status?location_id=${locationId}&date=${date}`,
  list: (from: string, to: string, locationId: number) =>
    `/days?from=${from}&to=${to}&location_id=${locationId}`,
  close: () => "/days/close",
  reopen: () => "/days/reopen",
};
