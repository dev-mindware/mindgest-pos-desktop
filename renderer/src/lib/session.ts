import { Role } from "@/types";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ROLE_KEY,
} from "@/constants/routes";

export interface SessionPayload {
  accessToken: string;
  refreshToken: string;
  role?: Role;
  user?: any;
}

export async function createSession(payload: SessionPayload) {
  if (typeof window !== "undefined") {
    // Limpar cookies legados duplicados
    document.cookie = "session-accessToken=; path=/; max-age=0";
    document.cookie = "session-refreshToken=; path=/; max-age=0";
    document.cookie = "session-role=; path=/; max-age=0";

    if (payload.accessToken) {
      localStorage.setItem("access_token", payload.accessToken);
      localStorage.setItem("session-accessToken", payload.accessToken);
      document.cookie = `access_token=${payload.accessToken}; path=/; max-age=604800; SameSite=Lax`;
    }
    if (payload.refreshToken) {
      localStorage.setItem("refresh_token", payload.refreshToken);
      localStorage.setItem("session-refreshToken", payload.refreshToken);
      document.cookie = `refresh_token=${payload.refreshToken}; path=/; max-age=604800; SameSite=Lax`;
    }
    if (payload.role) {
      localStorage.setItem("user_role", payload.role);
      localStorage.setItem("session-role", payload.role);
      document.cookie = `user_role=${payload.role}; path=/; max-age=604800; SameSite=Lax`;
    }
    if (payload.user) {
      localStorage.setItem("user", JSON.stringify(payload.user));
    }
  }
}

export async function destroySession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("session-accessToken");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("session-refreshToken");
    localStorage.removeItem("user_role");
    localStorage.removeItem("session-role");
    localStorage.removeItem("user");

    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "refresh_token=; path=/; max-age=0";
    document.cookie = "user_role=; path=/; max-age=0";
    document.cookie = "session-accessToken=; path=/; max-age=0";
    document.cookie = "session-refreshToken=; path=/; max-age=0";
    document.cookie = "session-role=; path=/; max-age=0";
  }
}

export async function refreshAccessToken(newAccessToken: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    localStorage.setItem("session-accessToken", newAccessToken);
    document.cookie = `${ACCESS_TOKEN_KEY}=${newAccessToken}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = "session-accessToken=; path=/; max-age=0";
  }
}