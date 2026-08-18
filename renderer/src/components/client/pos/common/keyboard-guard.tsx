"use client";

import { KeyboardProvider } from "@/contexts";
import { VirtualKeyboard } from "@/components/common/virtual-keyboard";
import { useWorkspaceStore } from "@/stores/pos/workspace-store";

export function KeyboardGuard({ children }: { children: React.ReactNode }) {
    const { enableVirtualKeyboard } = useWorkspaceStore();

    return (
        <KeyboardProvider>
            {children}
            {enableVirtualKeyboard && <VirtualKeyboard />}
        </KeyboardProvider>
    );
}
