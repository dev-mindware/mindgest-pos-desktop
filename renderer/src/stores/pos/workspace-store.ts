import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
  disableVirtualKeyboard: boolean;
  setDisableVirtualKeyboard: (value: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      disableVirtualKeyboard: false,
      setDisableVirtualKeyboard: (disableVirtualKeyboard) =>
        set({ disableVirtualKeyboard }),
    }),
    {
      name: "workspace-settings",
    },
  ),
);
