"use client";

import { useEffect, useState } from "react";

// Singleton global network state across Next.js page transitions
let globalIsOnline =
  typeof window !== "undefined" ? window.navigator.onLine : true;
const listeners = new Set<(online: boolean) => void>();

import { useOfflineStore } from "@/stores/offline/offline-store";

function setGlobalOnline(online: boolean) {
  if (globalIsOnline !== online) {
    globalIsOnline = online;
    listeners.forEach((listener) => listener(online));
    try {
      useOfflineStore.getState().setNetworkStatus(online ? "online" : "offline");
    } catch {
      // Store might not be ready during SSR
    }
  }
}

async function verifyConnection() {
  if (typeof window === "undefined") return;

  // If OS reports offline, immediately update state
  if (!window.navigator.onLine) {
    setGlobalOnline(false);
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    await fetch("https://clients3.google.com/generate_204", {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });
    setGlobalOnline(true);
  } catch {
    setGlobalOnline(false);
  } finally {
    clearTimeout(timeoutId);
  }
}

let isGlobalListenerSetup = false;
function setupGlobalListeners() {
  if (isGlobalListenerSetup || typeof window === "undefined") return;
  isGlobalListenerSetup = true;

  window.addEventListener("online", () => verifyConnection());
  window.addEventListener("offline", () => setGlobalOnline(false));

  // Periodic heartbeat verification
  setInterval(() => {
    if (window.navigator.onLine) {
      verifyConnection();
    } else {
      setGlobalOnline(false);
    }
  }, 10000);
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(globalIsOnline);

  useEffect(() => {
    setupGlobalListeners();

    const handleChange = (status: boolean) => {
      setIsOnline(status);
    };

    listeners.add(handleChange);
    // Ensure local state matches global in case it changed before subscription
    setIsOnline(globalIsOnline);

    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return { isOnline, checkStatus: verifyConnection };
}

