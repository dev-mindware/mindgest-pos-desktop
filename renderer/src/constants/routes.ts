import { Role } from "@/types";

// Rotas públicas (acessíveis sem autenticação)
export const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/checkout",
  "/unauthorized",
  "/not-found",
] as const;

// Páginas de autenticação — se logado, redireciona para dashboard
export const AUTH_PAGES = [
  "/",
  "/auth/login",
  "/auth/register",
] as const;

// Prefixos de rotas privadas
export const PRIVATE_ROUTE_PREFIXES = [
  "/pos",
  "/clients",
  "/documents",
  "/items",
] as const;

// Rota de login padrão
export const DEFAULT_LOGIN_REDIRECT = "/auth/login";

// Rota de unauthorized
export const UNAUTHORIZED_REDIRECT = "/unauthorized";

// Prefixo de auth da API (NextAuth-like, se aplicável)
export const API_AUTH_PREFIX = "/api/auth";

// Cookies
export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const ROLE_KEY = "user_role";

// Mapa de redirect por role
export const ROLE_REDIRECTS: Record<Role, string> = {
  ADMIN: "/pos/counter",
  OWNER: "/pos/counter",
  MANAGER: "/pos/counter",
  CASHIER: "/pos/counter",
};

// Validação: roles aceitas (para validar cookie manipulado)
export const VALID_ROLES: Role[] = ["ADMIN", "OWNER", "MANAGER", "CASHIER"];