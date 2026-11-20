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
