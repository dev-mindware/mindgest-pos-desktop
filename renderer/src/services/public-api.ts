import axios from "axios";

/**
 * Public API client for unauthenticated requests
 * Used for public endpoints like document verification
 */
export const publicApi = axios.create({
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

// No authentication interceptors for public API
export default publicApi;
