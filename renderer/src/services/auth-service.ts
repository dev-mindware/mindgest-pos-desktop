import { LoginResponse, Role, User } from "@/types";
import api from "./api";
import { createSession, destroySession } from "@/lib/session";
import { getRouteByRole } from "@/utils/role-redirects";

export const authService = {
  getMe: async (): Promise<User | null> => {
    try {
      const response = await api.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuário atual:", error);
      return null;
    }
  },

  login: async (
    credentials: any,
  ): Promise<{
    user: User | null;
    redirectPath?: string;
    message?: string;
  }> => {
    try {
      // 1. OBTENÇÃO DA IMPRESSÃO DIGITAL FÍSICA PARA POS DESKTOP
      if (typeof window !== 'undefined' && (window as any).ipc) {
        try {
          const hwid = await (window as any).ipc.security.getHardwareId();
          credentials.hardwareId = hwid;
        } catch (e) {
          console.warn("Não foi possível obter HWID. Ambiente não-Electron?");
        }
      }

      const res = await api.post<LoginResponse>("/auth/login", credentials);
      const { user, tokens, message } = res.data;

      if (!user) {
        throw new Error("Usuário não autorizado");
      }

      // 2. GUARDA A LICENÇA OFFLINE NO SQLITE LOCAL (POS DESKTOP)
      if (typeof window !== 'undefined' && (window as any).ipc && (tokens as any).offlineLicense) {
        await (window as any).ipc.security.saveOfflineLicense((tokens as any).offlineLicense, user.storeId);
      }

      await createSession({
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      const redirectPath = getRouteByRole(user.role);
      return { message, user, redirectPath };
    } catch (error: any) {
      let messageError = "Ocorreu um erro inesperado!";
      if (error?.response?.data?.message) {
        messageError = error.response.data.message;
      } else if (error instanceof Error) {
        messageError = error.message;
      }
      return { user: null, message: messageError };
    }
  },

  logout: async (refreshToken?: string | null): Promise<void> => {
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error("Erro ao fazer logout na API:", error);
    } finally {
      await destroySession();
    }
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      "/auth/forgot-password",
      { email },
    );
    return response.data;
  },
};
