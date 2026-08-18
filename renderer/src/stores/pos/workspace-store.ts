import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
  enableVirtualKeyboard: boolean;
  setEnableVirtualKeyboard: (value: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      enableVirtualKeyboard: false,
      setEnableVirtualKeyboard: (enableVirtualKeyboard) =>
        set({ enableVirtualKeyboard }),
    }),
    {
      name: "workspace-settings",
    },
  ),
);
