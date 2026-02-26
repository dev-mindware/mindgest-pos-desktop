import axios from "axios";
import { getAccessToken } from "@/actions/token";
import { reauthenticate } from "@/actions/auth";

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
    process.env.NEXT_PUBLIC_API_URL || "https://mindgest.mindware-vps.cloud/api",
  headers: {
    "Content-Type": "application/json",
  },
});

import { currentStoreStore } from "@/stores";

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
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

  // Specific routes or patterns to exclude from injection
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
      // For GET requests, add to params
      if (currentMethod === "get") {
        config.params = {
          ...config.params,
          storeId: config.params?.storeId || currentStore.id,
        };
      }
      // For other requests, add to data if it's an object
      else if (
        config.data &&
        typeof config.data === "object" &&
        !config.data.storeId
      ) {
        config.data = {
          ...config.data,
          storeId: currentStore.id,
        };
      }
      // If no data is present but it's a POST/PUT/PATCH, we might want to add storeId
      else if (
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

    if (err.response?.status === 401) {
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
        await reauthenticate();
        const newToken = await getAccessToken();

        if (newToken) {
          processQueue(null, newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error("Erro ao renovar token:", refreshError);
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
