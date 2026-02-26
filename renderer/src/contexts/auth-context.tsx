"use client";
import { useFetchUser } from "@/hooks/common";
import { useAuthStore } from "@/stores";
import { Loader } from "./loader";
import { usePathname } from "next/navigation";


interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_PATHS = ["/auth", "/login", "/register"];

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const { isAuthenticating } = useAuthStore();
  useFetchUser({ enabled: !isAuthRoute });

  if (isAuthRoute) {
    return <>{children}</>;
  }


  if (isAuthenticating) {
    return <Loader />;
  }

  return <>{children}</>;
}