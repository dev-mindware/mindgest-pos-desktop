import { Company, Store } from "./company";

export interface LoginResponse {
  message: string;
  user: User;
  tokens: Tokens;
}

export type Role = 'ADMIN' | 'OWNER' | 'MANAGER' | "CASHIER"

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string,
  company: Company;
  store?: Store
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}