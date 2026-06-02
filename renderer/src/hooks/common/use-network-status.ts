"use client";
import { useState, useEffect, useCallback } from "react";

export function useNetworkStatus(pingInterval = 5000) {
  const [isOnline, setIsOnline] = useState(true); // Assume online initially to avoid UI flicker

  const checkStatus = useCallback(async () => {
    // First line of defense: if the OS says we're offline, we are offline
    if (typeof window !== "undefined" && !window.navigator.onLine) {
      setIsOnline(false);
      return;
    }

    try {
      // Second line of defense: Actual HTTP ping to check if we can reach the open internet.
      // Using a fast, widely available endpoint that returns 204 No Content to minimize bandwidth
      // and explicitly bypass CORS restrictions by using fetch with mode: 'no-cors'
      await fetch("https://clients3.google.com/generate_204", {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-store",
      });
      setIsOnline(true);
    } catch (error) {
        // console.log("Ping failed, marking offline", error);
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkStatus();

    // Periodic check
    const intervalId = setInterval(checkStatus, pingInterval);

    // Event listeners for immediate state changes (OS level)
    const handleOnline = () => checkStatus(); // Don't just trust it, verify it
    const handleOffline = () => setIsOnline(false); // Trust offline events immediately

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkStatus, pingInterval]);

  return { isOnline };
}
