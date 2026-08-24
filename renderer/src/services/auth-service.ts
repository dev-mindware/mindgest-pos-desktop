import { LoginResponse, Role, User } from "@/types";
import api from "./api";
import publicApi from "./public-api";
import { createSession, destroySession } from "@/lib/session";
import { getRouteByRole } from "@/utils/role-redirects";

export const authService = {
  getMe: async (): Promise<User | null> => {
    try {
      const response = await api.get<User>("/auth/profile");
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

      const res = await publicApi.post<any>("/auth/login", credentials);
      const resData = res.data?.data || res.data;
      const user = resData?.user || res.data?.user;
      const tokens = resData?.tokens || res.data?.tokens || {
        accessToken: resData?.accessToken || res.data?.accessToken,
        refreshToken: resData?.refreshToken || res.data?.refreshToken,
        offlineLicense: resData?.offlineLicense || res.data?.offlineLicense,
      };
      const message = resData?.message || res.data?.message;

      if (!user) {
        throw new Error("Usuário não autorizado");
      }

      // Validação de Perfil: Usuários ADMIN não têm acesso ao POS Desktop
      if (user.role === "ADMIN") {
        throw new Error("Utilizadores Administradores não têm acesso ao POS Desktop.");
      }

      // Validação de Plano: Plano Base não tem acesso ao POS
      const userPlan = user.company?.subscription?.plan?.name;
      if (userPlan && userPlan.toUpperCase().includes("BASE")) {
        throw new Error("O plano Base não inclui acesso ao Ponto de Venda (POS). Atualize para o plano Smart ou Pro para aceder.");
      }

      // 2. GUARDA A LICENÇA OFFLINE NO SQLITE LOCAL (POS DESKTOP)
      const storeId = user.storeId || user.company?.stores?.[0]?.id;
      
      if (typeof window !== 'undefined' && (window as any).ipc && tokens?.offlineLicense && storeId) {
        await (window as any).ipc.security.saveOfflineLicense(tokens.offlineLicense, storeId);
      }

      await createSession({
        user,
        accessToken: tokens?.accessToken || "",
        refreshToken: tokens?.refreshToken || "",
        role: user.role,
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

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await api.patch<{ message: string }>(
      "/auth/change-password",
      data,
    );
    return response.data;
  },
};
