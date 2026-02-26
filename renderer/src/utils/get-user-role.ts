import { Role } from "@/types";

export function getUserRole(level: Role): string {
  switch (level) {
    case "ADMIN":
      return "admin";
    case "OWNER":
      return "owner";
    case "MANAGER":
      return "manager";
    case "CASHIER":
      return "cashier";
    default:
      return "owner";
  }
}