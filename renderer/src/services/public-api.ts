import axios from "axios";

/**
 * Public API client for unauthenticated requests
 * Used for public endpoints like document verification
 */
export const publicApi = axios.create({
  baseURL:
    "https://mindgest.mindware-vps.cloud/api" || "https://mindgest-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// No authentication interceptors for public API
export default publicApi;
