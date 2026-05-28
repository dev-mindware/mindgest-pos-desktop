import { create } from "zustand";

interface SecurityState {
  isTimeTravelLocked: boolean;
  tamperingReason: string | null;
  lockApp: (reason: string) => void;
  unlockApp: () => void;
}

export const useSecurityStore = create<SecurityState>((set) => ({
  isTimeTravelLocked: false,
  tamperingReason: null,
  lockApp: (reason) => set({ isTimeTravelLocked: true, tamperingReason: reason }),
  unlockApp: () => set({ isTimeTravelLocked: false, tamperingReason: null }),
}));
