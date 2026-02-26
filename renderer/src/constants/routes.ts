export const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/checkout",
  "/unauthorized",
  "/not-found",
];

export const PRIVATE_ROUTE_PREFIXES = ["/admin", "/documents",
  "/plans",
  "/dashboard",
  "/settings",
  "/items",
  "/management",
  "/pos-management",
  "/reports",
  "/stock",
];

export const API_AUTH_PREFIX = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT = "/auth/login";
export const UPGRADE_REDIRECT = "/pricing";