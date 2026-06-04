"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UpdateButton() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const ipcBridgeRef = useRef<any>(null);
  const hasIpc = typeof window !== "undefined" && !!(window as any).ipc?.update;
  const router = useRouter();

  const handleUpdateAvailable = () => {
    setUpdateAvailable(true);
    toast.info("Atualização disponível", {
      description: "Clique no ícone para ir às configurações",
      duration: 5000,
    });
  };

  const handleUpdateDownloaded = () => {
    setUpdateAvailable(true);
    toast.success("Atualização pronta", {
      description: "Vá às configurações para instalar",
      duration: 5000,
    });
  };

  const handleUpdateNotAvailable = () => {
    setUpdateAvailable(false);
  };

  useEffect(() => {
    if (!hasIpc) return;

    const ipcBridge = (window as any).ipc;
    ipcBridgeRef.current = ipcBridge;

    ipcBridge.on("update:available", handleUpdateAvailable);
    ipcBridge.on("update:downloaded", handleUpdateDownloaded);
    ipcBridge.on("update:not-available", handleUpdateNotAvailable);

    return () => {
      ipcBridge.off("update:available", handleUpdateAvailable);
      ipcBridge.off("update:downloaded", handleUpdateDownloaded);
      ipcBridge.off("update:not-available", handleUpdateNotAvailable);
    };
  }, [hasIpc]);

  if (!updateAvailable) return null;

  return (
    <Button
      onClick={() => router.push("/pos/settings?tab=general")}
      className="w-full justify-start text-xs font-semibold"
      variant="outline"
      size="sm"
    >
      <Icon name="Download" className="h-4 w-4 mr-2 text-amber-500 animate-pulse" />
      <span>Atualização disponível</span>
    </Button>
  );
}
