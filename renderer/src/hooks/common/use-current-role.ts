"use client";
import { Role } from "@/types";
import { getUserRole } from "@/utils";
import { useAuth } from "@/hooks/auth";

export function useCurrentRole() {
  const { user } = useAuth();

  const isAdmin = getUserRole(user?.role as Role) == "admin";

  return {
    currentRole: getUserRole(user?.role as Role),
    isAdmin,
  };
}
