"use client";

import { KeyboardProvider } from "@/contexts";
import { VirtualKeyboard } from "@/components/common/virtual-keyboard";
import { useWorkspaceStore } from "@/stores/pos/workspace-store";
import { useIsMobile } from "@/hooks";

export function KeyboardGuard({ children }: { children: React.ReactNode }) {
  const { enableVirtualKeyboard } = useWorkspaceStore();
  const isMobile = useIsMobile();

  return (
    <KeyboardProvider>
      {children}
      {!isMobile && enableVirtualKeyboard && <VirtualKeyboard />}
    </KeyboardProvider>
  );
}
