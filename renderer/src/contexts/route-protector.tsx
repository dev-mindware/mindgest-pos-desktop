"use client";
import { useEffect, useState } from "react";
import { SubscriptionStatus, Role } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";

interface RouteProtectorProps {
  allowed: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RouteProtector({
  allowed,
  children,
  fallback,
}: RouteProtectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { user, isAuthenticating, subscriptionStatus } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isAuthenticating) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (user.role === "ADMIN" || !allowed.includes(user.role)) {
      router.replace("/unauthorized");
      return;
    }

    const userPlan = user.company?.subscription?.plan?.name;
    if (userPlan && userPlan.toUpperCase().includes("BASE")) {
      router.replace("/unauthorized");
      return;
    }

    if (
      subscriptionStatus === SubscriptionStatus.PENDING &&
      !pathname.startsWith("/settings") &&
      !pathname.startsWith("/plans")
    ) {
      router.replace("/settings?tab=subscription");
    }
  }, [user, allowed, router, isAuthenticating, pathname, subscriptionStatus, isMounted]);

  if (!isMounted) {
    return <>{children}</>;
  }

  // Enquanto está verificando autenticação/autorização
  if (isAuthenticating) {
    return fallback ? <>{fallback}</> : null;
  }

  // Se não há usuário após verificação, retorna null (redirecionamento já foi feito)
  if (!user) {
    return null;
  }

  // Se usuário não tem permissão, retorna null (redirecionamento já foi feito)
  if (!allowed.includes(user.role)) {
    return null;
  }

  const userPlan = user.company?.subscription?.plan?.name;
  if (userPlan && userPlan.toUpperCase().includes("BASE")) {
    return null;
  }

  if (
    subscriptionStatus === SubscriptionStatus.PENDING &&
    !pathname.startsWith("/settings") &&
    !pathname.startsWith("/plans")
  ) {
    return null;
  }

  return <>{children}</>;
}
