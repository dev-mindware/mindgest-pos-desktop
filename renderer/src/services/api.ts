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
    "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

import { currentStoreStore } from "@/stores";

api.interceptors.request.use(async (config) => {
  // Use localStorage directly instead of Next.js server actions
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("session-accessToken")
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

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (original.url.includes("/auth/") || original._retry) {
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
        const refreshToken = localStorage.getItem("session-refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/auth/refresh`,
          {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!response.ok) throw new Error("Falha ao renovar o token");

        const data = await response.json();
        const newToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        localStorage.setItem("session-accessToken", newToken);
        localStorage.setItem("session-refreshToken", newRefreshToken);

        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error("Erro ao renovar token:", refreshError);
        localStorage.removeItem("session-accessToken");
        localStorage.removeItem("session-refreshToken");
        window.location.replace("/auth/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  },
);

export default api;
