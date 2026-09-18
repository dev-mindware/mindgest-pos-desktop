import axios from "axios";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://test.mindgest.mindware-vps.cloud/api", // Staging VPS
  headers: {
    "Content-Type": "application/json",
    "x-api-key":
      process.env.NEXT_PUBLIC_API_KEY ||
      "MG_REg4eFg5eDJQU0lmNWcKUQU0YN3BDZDNvU2dnSnQ5OXRiL3NtbEhqSzhpdXNDZ2V6T2NwbzlCYnJDRWBTkJna3Foa2lHOXcwQkFRRUZBQVNZkbQo2lmN4eFg_MG",
  },
  timeout: 30000,
});

export const localApi = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

localApi.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined" && (window as any).ipc?.lan) {
    try {
      const lanConfig = await (window as any).ipc.lan.getConfig();
      if ((lanConfig.terminalMode === 'SLAVE' || lanConfig.terminalMode === 'TERMINAL') && lanConfig.masterIp) {
        config.baseURL = `http://${lanConfig.masterIp}:3333/api`;
      } else {
        config.baseURL = `http://127.0.0.1:3333/api`;
      }
      
      if (lanConfig.lanSecret) {
        config.headers['X-LAN-Secret'] = lanConfig.lanSecret;
      }
    } catch (e) {
      console.warn("Failed to get LAN config for localApi", e);
    }
  } else {
    config.baseURL = `http://127.0.0.1:3333/api`;
  }

  // Inject storeId logic
  const STORE_DEPENDENT_ROUTES = ["items", "clients", "cash-sessions", "invoice"];
  const currentMethod = config.method?.toLowerCase() || "";
  const shouldInject = config.url && STORE_DEPENDENT_ROUTES.some(r => config.url?.includes(r));

  if (shouldInject) {
    const currentStore = currentStoreStore.getState().currentStore;
    if (currentStore?.id) {
      if (currentMethod === "get") {
        config.params = { ...config.params, storeId: config.params?.storeId || currentStore.id };
      } else if (config.data && typeof config.data === "object" && !config.data.storeId) {
        config.data = { ...config.data, storeId: currentStore.id };
      } else if (!config.data && ["post", "put", "patch"].includes(currentMethod)) {
        config.data = { storeId: currentStore.id };
      }
    }
  }

  return config;
});

import { currentStoreStore } from "@/stores";
import { destroySession } from "@/lib/session";

api.interceptors.request.use(async (config) => {
  // Use localStorage directly instead of Next.js server actions
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("session-accessToken") || localStorage.getItem("access_token")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Routes that require storeId injection
  const STORE_DEPENDENT_ROUTES: (
    | string
    | { path: string; methods: string[] }
  )[] = [
      "invoice",
      "items",
      { path: "stocks", methods: ["get"] },
      "cash-sessions",
      "reports/dashboard",
      "receipt",
      "documents",
      "dashboard",
      { path: "credit-note", methods: ["get"] },
      { path: "categories", methods: ["get", "post"] },
    ];

  const EXCLUDED_ROUTES = [
    "/expenses",
    "receipt",
    "/close",
    "global",
    "public",
  ];

  const currentMethod = config.method?.toLowerCase() || "";
  const matchingRoute = STORE_DEPENDENT_ROUTES.find((route) => {
    const routePath = typeof route === "string" ? route : route.path;
    return config.url?.includes(routePath);
  });

  const isExcluded = EXCLUDED_ROUTES.some((route) =>
    config.url?.includes(route),
  );

  const shouldInject =
    config.url &&
    matchingRoute &&
    !isExcluded &&
    (typeof matchingRoute === "string" ||
      matchingRoute.methods.includes(currentMethod));

  if (shouldInject) {
    const currentStore = currentStoreStore.getState().currentStore;
    if (currentStore?.id) {
      if (currentMethod === "get") {
        config.params = {
          ...config.params,
          storeId: config.params?.storeId || currentStore.id,
        };
      } else if (
        config.data &&
        typeof config.data === "object" &&
        !config.data.storeId
      ) {
        config.data = {
          ...config.data,
          storeId: currentStore.id,
        };
      } else if (
        !config.data &&
        ["post", "put", "patch"].includes(currentMethod)
      ) {
        config.data = { storeId: currentStore.id };
      }
    }
  }

  const FAST_TIMEOUT_ROUTES = ["/items", "/categories", "/clients", "/cash-sessions", "/series"];
  if (config.url && FAST_TIMEOUT_ROUTES.some((r) => config.url?.includes(r))) {
    if (currentMethod === "get" && (!config.timeout || config.timeout > 4000)) {
      config.timeout = 4000;
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (!original || !original.url) {
      return Promise.reject(err);
    }

    // 🛡️ Fallback Automático para LAN / Local SQLite se a API Cloud estiver inacessível
    const isNetworkOrTimeout =
      !err.response ||
      err.code === "ERR_NETWORK" ||
      err.code === "ECONNABORTED" ||
      err.message?.includes("Network Error") ||
      err.message?.includes("timeout");

    const OFFLINE_SUPPORTED_ROUTES = [
      "/items",
      "/categories",
      "/clients",
      "/cash-sessions",
      "/series",
    ];

    const canFallback =
      isNetworkOrTimeout &&
      original.url &&
      OFFLINE_SUPPORTED_ROUTES.some((r) => original.url.includes(r)) &&
      !original._isLocalFallback;

    if (canFallback) {
      original._isLocalFallback = true;
      try {
        console.log(`📡 [LAN Offline Fallback] Nuvem inacessível. Redirecionando ${original.url} para API local/Master...`);
        const localResponse = await localApi({
          ...original,
          url: original.url,
          baseURL: undefined, // Deixa o interceptor do localApi injetar http://127.0.0.1:3333/api ou Master IP
        });
        return localResponse;
      } catch (localErr: any) {
        console.warn(`⚠️ [LAN Offline Fallback] Chamada local também falhou:`, localErr?.message || localErr);
      }
    }

    const isNonRefreshableAuthRoute =
      original.url.includes("/auth/login") ||
      original.url.includes("/auth/refresh") ||
      original.url.includes("/auth/register");

    if (isNonRefreshableAuthRoute || original._retry) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && typeof window !== "undefined") {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = "Bearer " + token;
            return api(original);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        let refreshToken =
          localStorage.getItem("session-refreshToken") ||
          localStorage.getItem("refresh_token");
        if (!refreshToken || refreshToken === "undefined" || refreshToken === "null") {
          const match = document.cookie.match(/(?:session-refreshToken|refresh_token)=([^;]+)/);
          refreshToken = match ? match[1] : null;
        }

        if (!refreshToken || refreshToken === "undefined" || refreshToken === "null") {
          throw new Error("Nenhum refresh token válido disponível.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://test.mindgest.mindware-vps.cloud/api"}/auth/refresh`, // Staging VPS
          {
            method: "POST",
            body: JSON.stringify({ 
              refreshToken,
              refresh_token: refreshToken 
            }),
            headers: {
              "Content-Type": "application/json",
              "x-api-key":
                process.env.NEXT_PUBLIC_API_KEY ||
                "MG_REg4eFg5eDJQU0lmNWcKUQU0YN3BDZDNvU2dnSnQ5OXRiL3NtbEhqSzhpdXNDZ2V6T2NwbzlCYnJDRWBTkJna3Foa2lHOXcwQkFRRUZBQVNZkbQo2lmN4eFg_MG",
            },
          },
        );

        if (!response.ok) throw new Error("Falha ao renovar o token");

        const data = await response.json();
        const resData = data?.data || data;
        const newToken = resData?.accessToken || resData?.tokens?.accessToken || data?.accessToken;
        const nextRefreshToken = resData?.refreshToken || resData?.tokens?.refreshToken || data?.refreshToken || refreshToken;

        if (newToken) {
          localStorage.setItem("access_token", newToken);
          localStorage.setItem("session-accessToken", newToken);
          document.cookie = `access_token=${newToken}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = "session-accessToken=; path=/; max-age=0";
        }

        if (nextRefreshToken && nextRefreshToken !== "undefined" && nextRefreshToken !== "null") {
          localStorage.setItem("refresh_token", nextRefreshToken);
          localStorage.setItem("session-refreshToken", nextRefreshToken);
          document.cookie = `refresh_token=${nextRefreshToken}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = "session-refreshToken=; path=/; max-age=0";
        }

        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error("Erro ao renovar token:", refreshError);
        await destroySession();
        if (typeof window !== "undefined" && window.location.pathname !== "/auth/login") {
          window.location.replace("/auth/login");
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  },
);

export default api;
