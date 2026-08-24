"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { api } from "@/services/api";
import { User } from "@/types";
import { destroySession } from "@/lib/session";

async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<any>("/auth/profile");
  const userData = data?.data || data?.user || data;
  return userData;
}

interface UseFetchUserOptions {
  enabled?: boolean;
}

export function useFetchUser({ enabled = true }: UseFetchUserOptions = {}) {
  const { setUser, setIsAuthenticating } = useAuthStore();
  const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("session-accessToken"));

  const query = useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    enabled: enabled && hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!enabled || !hasToken) {
      setIsAuthenticating(false);
      return;
    }

    if (query.isSuccess && query.data) {
      setUser(query.data);
      setIsAuthenticating(false);
    }

    if (query.isError) {
      setIsAuthenticating(false);
      const isUnauthorized = (query.error as any)?.response?.status === 401;
      if (isUnauthorized) {
        (async () => {
          await destroySession();
          setUser(null);
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/auth/login"
          ) {
            window.location.replace("/auth/login");
          }
        })();
      }
    }
  }, [
    enabled,
    hasToken,
    query.isSuccess,
    query.isError,
    query.data,
    query.error,
    setUser,
    setIsAuthenticating,
  ]);

  // Listener para evento de sessão expirada (vindo do interceptor axios)
  useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
      setIsAuthenticating(false);
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/auth/login"
      ) {
        window.location.replace("/auth/login");
      }
    }

    window.addEventListener("session:expired", handleSessionExpired);
    return () =>
      window.removeEventListener("session:expired", handleSessionExpired);
  }, [setUser, setIsAuthenticating]);

  return query;
}
