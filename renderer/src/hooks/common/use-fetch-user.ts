"use client";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores";
import { api } from "@/services/api";
import { User } from "@/types";

interface UseFetchUserOptions {
  enabled?: boolean;
}

export function useFetchUser({ enabled = true }: UseFetchUserOptions = {}) {
  const { setUser, user, setIsAuthenticating } = useAuthStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setIsAuthenticating(false);
      return;
    }

    if (user !== null) {
      setIsAuthenticating(false);
      return;
    }

    if (hasFetched.current) {
      return;
    }

    let isMounted = true;
    hasFetched.current = true;
    // Ensure we start in a loading state if we are going to fetch
    setIsAuthenticating(true);

    const fetchUser = async () => {
      try {
        const response = await api.get<User>("/auth/profile");

        if (!isMounted) return;

        setUser(response.data);
      } catch (error: any) {
        if (!isMounted) return;

        if (error.response?.status !== 401) {
          console.error("Erro ao buscar usuário:", error);
        }
        setUser(null);
      } finally {
        if (isMounted) {
          setIsAuthenticating(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user };
}
