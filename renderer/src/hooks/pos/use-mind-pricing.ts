import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export interface MindPricingConfig {
  isMindPricingEnabled: boolean;
  setMindPricingEnabled: (enabled: boolean) => void;
  triggerPricingRecalculation: () => Promise<void>;

  isRecommendationsEnabled: boolean;
  setRecommendationsEnabled: (enabled: boolean) => void;
}

export const useMindPricingConfig = create<MindPricingConfig>()(
  persist(
    (set, get) => ({
      isMindPricingEnabled: false, // Default is disabled per user instructions to be configurable
      setMindPricingEnabled: async (enabled: boolean) => {
        set({ isMindPricingEnabled: enabled });
        try {
          // Notify the Python backend
          await axios.post("http://localhost:5001/api/ai/pricing/toggle", {
            enabled,
          });
        } catch (error) {
          console.error(
            "Failed to notify Mind Microservice about config change:",
            error,
          );
        }
      },

      isRecommendationsEnabled: true, // Default enabled for UX flow since we're displaying it
      setRecommendationsEnabled: (enabled: boolean) => {
        set({ isRecommendationsEnabled: enabled });
      },
      triggerPricingRecalculation: async () => {
        if (!get().isMindPricingEnabled) return;
        try {
          await axios.post("http://localhost:5001/api/ai/pricing/recalculate");
        } catch (error) {
          console.error("Failed to trigger Mind Pricing Recalculation:", error);
        }
      },
    }),
    {
      name: "mind-pricing-config",
    },
  ),
);
