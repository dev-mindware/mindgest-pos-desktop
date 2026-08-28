import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
  enableVirtualKeyboard: boolean;
  disableVirtualKeyboard: boolean;
  useThermalPrinter: boolean;
  autoOpenDrawerOnCash: boolean;
  printerTransport: 'spooler' | 'tcp';
  printerHost: string;
  printerPort: number;
  drawerPin: 2 | 5;
  setEnableVirtualKeyboard: (value: boolean) => void;
  setDisableVirtualKeyboard: (value: boolean) => void;
  setUseThermalPrinter: (value: boolean) => void;
  setAutoOpenDrawerOnCash: (value: boolean) => void;
  setPrinterTransport: (value: 'spooler' | 'tcp') => void;
  setPrinterHost: (value: string) => void;
  setPrinterPort: (value: number) => void;
  setDrawerPin: (value: 2 | 5) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      enableVirtualKeyboard: true,
      disableVirtualKeyboard: false,
      useThermalPrinter: true,
      autoOpenDrawerOnCash: true,
      printerTransport: 'spooler',
      printerHost: '',
      printerPort: 9100,
      drawerPin: 2,
      setEnableVirtualKeyboard: (enableVirtualKeyboard) =>
        set({
          enableVirtualKeyboard,
          disableVirtualKeyboard: !enableVirtualKeyboard,
        }),
      setDisableVirtualKeyboard: (disableVirtualKeyboard) =>
        set({
          disableVirtualKeyboard,
          enableVirtualKeyboard: !disableVirtualKeyboard,
        }),
      setUseThermalPrinter: (useThermalPrinter) => set({ useThermalPrinter }),
      setAutoOpenDrawerOnCash: (autoOpenDrawerOnCash) => set({ autoOpenDrawerOnCash }),
      setPrinterTransport: (printerTransport) => set({ printerTransport }),
      setPrinterHost: (printerHost) => set({ printerHost }),
      setPrinterPort: (printerPort) => set({ printerPort }),
      setDrawerPin: (drawerPin) => set({ drawerPin }),
    }),
    {
      name: "workspace-settings",
    },
  ),
);
