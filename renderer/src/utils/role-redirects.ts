/* import { Role } from "@/types";

export const DEFAULT_LOGIN_REDIRECT = "/auth/login";

export const roleRedirects: Record<Role, string> = {
  "ADMIN": "/admin/dashboard",
  "OWNER": "/dashboard",
  "MANAGER": "/dashboard",
  "CASHIER": "/pos/counter",
};

export const getRouteByRole = (role: Role): string => {
  if (!role) return DEFAULT_LOGIN_REDIRECT;
  return roleRedirects[role] || DEFAULT_LOGIN_REDIRECT;
};
 */


import { Role } from "@/types";
import {
  DEFAULT_LOGIN_REDIRECT,
  ROLE_REDIRECTS,
  UNAUTHORIZED_REDIRECT,
  VALID_ROLES,
} from "@/constants/routes";

export const roleRedirects = ROLE_REDIRECTS;

/**
 * Valida se um valor é uma Role válida.
 * Protege contra cookies manipulados.
 */
export function isValidRole(value: unknown): value is Role {
  return typeof value === "string" && VALID_ROLES.includes(value as Role);
}

/**
 * Retorna a rota baseada no role, com fallback seguro.
 * Se role for ADMIN ou inválido, retorna unauthorized/login.
 */
export function getRouteByRole(role: unknown): string {
  if (role === "ADMIN") return UNAUTHORIZED_REDIRECT;
  if (!isValidRole(role)) return DEFAULT_LOGIN_REDIRECT;
  return ROLE_REDIRECTS[role] || DEFAULT_LOGIN_REDIRECT;
}