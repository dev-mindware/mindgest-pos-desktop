import { create } from "zustand";
import { User } from "@/types";
import { authService } from "@/services/auth-service";

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

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("session-refreshToken")
          : null;
      await authService.logout(refreshToken);
    } finally {
      set({ user: null, isLoggingOut: false });
      if (typeof window !== "undefined") {
        window.location.replace("/auth/login");
      }
    }
  },
}));
