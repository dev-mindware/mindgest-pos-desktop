import { create } from "zustand";
import { User } from "@/types";
import { destroySession } from "@/lib/session";
import { queryClient } from "@/lib";

interface AuthState {
  user: User | null;
  isAuthenticating: boolean;
  isLoggingOut: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
  logout: () => Promise<void>;
}

function getInitialUser(): User | null {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined" && stored !== "null") {
        return JSON.parse(stored);
      }
    } catch {
      return null;
    }
  }
  return null;
}

function hasInitialToken(): boolean {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("session-accessToken");
    return Boolean(token && token !== "undefined" && token !== "null");
  }
  return false;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  isAuthenticating: typeof window !== "undefined" ? !hasInitialToken() && !getInitialUser() : true,
  isLoggingOut: false,

  setUser: (user) => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
    set({ user });
  },
  setIsAuthenticating: (isAuthenticating) => set({ isAuthenticating }),

  logout: async () => {
    // Bloquear logout em modo offline para proteger dados locais e manter a sessão
    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
    if (isOffline) {
      const { WarningMessage } = await import("@/utils/messages");
      WarningMessage("Não é possível terminar sessão em modo offline. Conecte-se à internet para sincronizar e sair em segurança.");
      return;
    }

    // Evita logout duplo
    if (get().isLoggingOut) return;

    set({ isLoggingOut: true, isAuthenticating: true, user: null });

    try {
      await destroySession();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      queryClient.clear();
      set({ isLoggingOut: false });

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/auth/login"
      ) {
        window.location.replace("/auth/login");
      } else {
        set({ isAuthenticating: false });
      }
    }
  },
}));

/* import { create } from "zustand";
import { User } from "@/types";
import { logoutAction } from "@/actions/login";
import { queryClient } from "@/lib";

interface AuthState {
  user: User | null;
  isAuthenticating: boolean;
  isLoggingOut: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticating: true,
  isLoggingOut: false,

  setUser: (user) => set({ user }),
  setIsAuthenticating: (isAuthenticating) => set({ isAuthenticating }),

  // ✅ Limpa estado, React Query e redireciona
  logout: async () => {
    set({ isLoggingOut: true, isAuthenticating: true, user: null }); // bloqueia tudo antes
    try {
      await logoutAction();
    } catch (error) {
      console.error("🚨 Erro ao fazer logout remoto:", error);
    } finally {
      queryClient.clear(); // Limpa toda a cache antiga (incluindo o ["user"])
      if (typeof window !== "undefined") {
        localStorage.removeItem("current-store");
        localStorage.removeItem("MGEST-AUTH-STORE");
        window.location.replace("/auth/login"); // Hard redirect para limpar a memória do browser
      }
      set({ isLoggingOut: false });
    }
  },
}));
 */