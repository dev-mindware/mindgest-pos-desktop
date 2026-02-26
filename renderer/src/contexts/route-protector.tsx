"use client";
import { useEffect } from "react";
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
  const { user, isAuthenticating, subscriptionStatus } = useAuth();

  useEffect(() => {
    // Só redireciona após autenticação completa
    if (isAuthenticating) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!allowed.includes(user.role)) {
      router.replace("/unauthorized");
    }

    if (
      subscriptionStatus === SubscriptionStatus.PENDING &&
      !pathname.startsWith("/settings") &&
      !pathname.startsWith("/plans")
    ) {
      router.replace("/settings?tab=subscription");
    }
  }, [user, allowed, router, isAuthenticating, pathname, subscriptionStatus]);

  // Enquanto está verificando autenticação/autorização
  if (isAuthenticating) {
    return (
      fallback || (
        <div className="flex items-center justify-center bg-red-600 min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )
    );
  }

  // Se não há usuário após verificação, retorna null (redirecionamento já foi feito)
  if (!user) {
    return null;
  }

  // Se usuário não tem permissão, retorna null (redirecionamento já foi feito)
  if (!allowed.includes(user.role)) {
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
