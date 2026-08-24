"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFetchUser } from "@/hooks/common";
import { useAuthStore } from "@/stores";
import { Loader } from "./loader";
import { roleRedirects } from "@/utils";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_PATHS = ["/", "/auth/login", "/auth/register"];

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Normalize pathname to support trailing slashes
  const normalizedPath = pathname?.replace(/\/+$/, "") || "/";
  const isAuthRoute = AUTH_PATHS.includes(pathname) || AUTH_PATHS.includes(normalizedPath);

  const { isAuthenticating, user } = useAuthStore();

  // We should still fetch user even on authRoutes if they might be logged in,
  // so we can redirect them to the dashboard if they are.
  useFetchUser();

  useEffect(() => {
    if (!isMounted) return;
    const hasToken = Boolean(localStorage.getItem("access_token") || localStorage.getItem("session-accessToken"));

    if (!isAuthenticating && isAuthRoute) {
      if (user && !hasToken) {
        useAuthStore.getState().setUser(null);
        return;
      }

      if (user && hasToken) {
        if (user.role === "ADMIN") {
          router.replace("/unauthorized");
          return;
        }
        const userPlan = user.company?.subscription?.plan?.name;
        if (userPlan && userPlan.toUpperCase().includes("BASE")) {
          router.replace("/unauthorized");
          return;
        }
        // User is already logged in but tried to access login page, redirect to POS based on role
        const redirectPath = roleRedirects[user.role] || "/pos/counter";
        router.replace(redirectPath);
      }
    }
  }, [user, isAuthenticating, isAuthRoute, isMounted, router]);

  if (!isMounted) {
    return <>{children}</>;
  }

  const hasToken = Boolean(localStorage.getItem("access_token") || localStorage.getItem("session-accessToken"));

  // If the user is authenticated and has a valid token on an auth route, we show the Loader while redirecting
  if (isAuthRoute && user && hasToken) {
    return <Loader />;
  }

  // If we are still checking authentication state and it's NOT an auth route, show loader
  if (isAuthenticating && !isAuthRoute) {
    return <Loader />;
  }

  return <>{children}</>;
}

