"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFetchUser } from "@/hooks/common";
import { useAuthStore } from "@/stores";
import { Loader } from "./loader";
import { roleRedirects } from "@/utils";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_PATHS = ["/", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"];

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  // Normalize pathname to support trailing slashes
  const normalizedPath = pathname?.replace(/\/+$/, "") || "/";
  const isAuthRoute = AUTH_PATHS.includes(pathname) || AUTH_PATHS.includes(normalizedPath);

  const { isAuthenticating, user } = useAuthStore();

  // We should still fetch user even on authRoutes if they might be logged in,
  // so we can redirect them to the dashboard if they are.
  useFetchUser();

  useEffect(() => {
    if (!isAuthenticating && user && isAuthRoute) {
      // User is already logged in but tried to access login page, redirect to dashboard based on role
      const redirectPath = roleRedirects[user.role] || "/pos";
      router.replace(redirectPath);
    }
  }, [user, isAuthenticating, isAuthRoute, router]);

  // If the user is authenticated and is on an auth route, we show the Loader while redirecting
  if (isAuthRoute && user) {
    return <Loader />;
  }

  // If we are still checking authentication state and it's NOT an auth route, show loader
  // (We don't block auth routes so users can immediately see the login form while checking session in background)
  if (isAuthenticating && !isAuthRoute) {
    return <Loader />;
  }

  return <>{children}</>;
}

