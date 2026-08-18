import { Role } from "@/types";

export const DEFAULT_LOGIN_REDIRECT = "/auth/login";

export const roleRedirects: Record<Role, string> = {
  "ADMIN": "/documents",
  "OWNER": "/documents",
  "MANAGER": "/documents",
  "CASHIER": "/pos/counter",
};

export const getRouteByRole = (role: Role): string => {
  if (!role) return DEFAULT_LOGIN_REDIRECT;
  return roleRedirects[role] || DEFAULT_LOGIN_REDIRECT;
};
