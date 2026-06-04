"use client";

import { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

const hasIpcUpdate = (): boolean => {
  return typeof window !== "undefined" && !!(window as any).ipc?.update;
};

const formatVersion = (info: any): string => {
  if (!info) return "nova versão";
  return info.version ? `v${info.version}` : info.releaseName || "nova versão";
};

export function AutoUpdateManager() {
  const updateApiRef = useRef<any>(null);
  const checkedRef = useRef(false);

  const downloadUpdate = useCallback(async () => {
    if (!updateApiRef.current) return;
    try {
      await updateApiRef.current.downloadUpdate();
      toast.info("Download da atualização iniciado.", { duration: 3000 });
    } catch (error) {
      console.error("[AutoUpdate] downloadUpdate failed", error);
      toast.error("Falha ao iniciar download da atualização.");
    }
  }, []);

  const installUpdate = useCallback(async () => {
    if (!updateApiRef.current) return;
    try {
      await updateApiRef.current.installUpdate();
    } catch (error) {
      console.error("[AutoUpdate] installUpdate failed", error);
      toast.error("Falha ao instalar a atualização.");
    }
  }, []);

  const handleUpdateAvailable = useCallback(
    (_event: any, info: any) => {
      const version = formatVersion(info);
      toast(`Atualização disponível: ${version}`, {
        action: {
          label: "Baixar",
          onClick: downloadUpdate,
        },
        duration: 8000,
      });
    },
    [downloadUpdate],
  );

  const handleUpdateDownloaded = useCallback(
    (_event: any, info: any) => {
      const version = formatVersion(info);
      toast.success(`Atualização ${version} pronta para instalar`, {
        action: {
          label: "Instalar agora",
          onClick: installUpdate,
        },
        duration: 10000,
      });
    },
    [installUpdate],
  );

  const handleDownloadProgress = useCallback((_event: any, progress: any) => {
    const percent = Math.round(progress.percent || 0);
    toast(`Download: ${percent}%`, { duration: 2000 });
  }, []);

  const handleUpdateError = useCallback((_event: any, error: any) => {
    console.error("[AutoUpdate] update:error", error);
    toast.error(`Erro na atualização: ${error?.message || "verifique a ligação"}`);
  }, []);

  useEffect(() => {
    if (!hasIpcUpdate()) return;

    updateApiRef.current = (window as any).ipc.update;

    const updateBridge = updateApiRef.current;
    updateBridge.on("update:available", handleUpdateAvailable);
    updateBridge.on("update:download-progress", handleDownloadProgress);
    updateBridge.on("update:downloaded", handleUpdateDownloaded);
    updateBridge.on("update:error", handleUpdateError);

    if (!checkedRef.current) {
      checkedRef.current = true;
      updateBridge
        .checkForUpdates()
        .catch((error: any) => {
          console.error("[AutoUpdate] checkForUpdates failed", error);
          toast.error("Erro ao verificar atualizações.");
        });
    }

    return () => {
      updateBridge.off("update:available", handleUpdateAvailable);
      updateBridge.off("update:download-progress", handleDownloadProgress);
      updateBridge.off("update:downloaded", handleUpdateDownloaded);
      updateBridge.off("update:error", handleUpdateError);
    };
  }, [handleDownloadProgress, handleUpdateAvailable, handleUpdateDownloaded, handleUpdateError]);

  return null;
}
