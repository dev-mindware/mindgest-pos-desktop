"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components";

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

    const ipcBridge = (window as any).ipc;
    ipcBridge.on("update:available", handleUpdateAvailable);
    ipcBridge.on("update:download-progress", handleDownloadProgress);
    ipcBridge.on("update:downloaded", handleUpdateDownloaded);
    ipcBridge.on("update:error", handleUpdateError);

    if (!checkedRef.current) {
      checkedRef.current = true;
      updateApiRef.current
        .checkForUpdates()
        .catch((error: any) => {
          console.error("[AutoUpdate] checkForUpdates failed", error);
          toast.error("Erro ao verificar atualizações.");
        });
    }

    return () => {
      ipcBridge.off("update:available", handleUpdateAvailable);
      ipcBridge.off("update:download-progress", handleDownloadProgress);
      ipcBridge.off("update:downloaded", handleUpdateDownloaded);
      ipcBridge.off("update:error", handleUpdateError);
    };
  }, [handleDownloadProgress, handleUpdateAvailable, handleUpdateDownloaded, handleUpdateError]);

  return null;
}

export function AutoUpdateSection() {
  const [status, setStatus] = useState("Nenhuma verificação realizada.");
  const [progress, setProgress] = useState<number | null>(null);
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [appVersion, setAppVersion] = useState<string>("-");
  const updateApiRef = useRef<any>(null);

  const updateAvailable = !!updateInfo && !hasDownloaded;
  const hasIpc = hasIpcUpdate();

  const formatVersionLabel = (info: any) => {
    if (!info) return "nova versão";
    return info.version ? `v${info.version}` : info.releaseName || "nova versão";
  };

  const handleUpdateAvailable = useCallback((_event: any, info: any) => {
    setUpdateInfo(info);
    setHasDownloaded(false);
    setIsChecking(false);
    setIsDownloading(false);
    setProgress(null);
    setStatus(`Atualização disponível: ${formatVersionLabel(info)}`);
  }, []);

  const handleUpdateNotAvailable = useCallback(() => {
    setUpdateInfo(null);
    setHasDownloaded(false);
    setIsChecking(false);
    setIsDownloading(false);
    setProgress(null);
    setStatus("Nenhuma atualização disponível.");
  }, []);

  const handleDownloadProgress = useCallback((_event: any, progressData: any) => {
    setIsDownloading(true);
    setProgress(Math.round(progressData.percent || 0));
    setStatus(`Download em progresso: ${Math.round(progressData.percent || 0)}%`);
  }, []);

  const handleUpdateDownloaded = useCallback((_event: any, info: any) => {
    setHasDownloaded(true);
    setIsDownloading(false);
    setProgress(null);
    setUpdateInfo(info);
    setStatus(`Atualização ${formatVersionLabel(info)} pronta para instalar.`);
  }, []);

  const handleUpdateError = useCallback((_event: any, error: any) => {
    setIsChecking(false);
    setIsDownloading(false);
    setStatus(`Erro na atualização: ${error?.message || "verifique a ligação"}`);
  }, []);

  useEffect(() => {
    if (!hasIpc) return;

    const ipcBridge = (window as any).ipc;
    updateApiRef.current = ipcBridge.update;

    ipcBridge.on("update:available", handleUpdateAvailable);
    ipcBridge.on("update:not-available", handleUpdateNotAvailable);
    ipcBridge.on("update:download-progress", handleDownloadProgress);
    ipcBridge.on("update:downloaded", handleUpdateDownloaded);
    ipcBridge.on("update:error", handleUpdateError);

    ipcBridge.app.getVersion().then((version: string) => {
      setAppVersion(version);
    }).catch((error: any) => {
      console.error("[AutoUpdateSection] failed to read app version", error);
    });

    return () => {
      ipcBridge.off("update:available", handleUpdateAvailable);
      ipcBridge.off("update:not-available", handleUpdateNotAvailable);
      ipcBridge.off("update:download-progress", handleDownloadProgress);
      ipcBridge.off("update:downloaded", handleUpdateDownloaded);
      ipcBridge.off("update:error", handleUpdateError);
    };
  }, [hasIpc, handleDownloadProgress, handleUpdateAvailable, handleUpdateDownloaded, handleUpdateError, handleUpdateNotAvailable]);

  const checkForUpdates = async () => {
    if (!hasIpc || !updateApiRef.current) return;
    setIsChecking(true);
    setStatus("Verificando atualizações...");
    try {
      await updateApiRef.current.checkForUpdates();
    } catch (error) {
      console.error("[AutoUpdateSection] checkForUpdates failed", error);
      setStatus("Falha ao verificar atualizações.");
      setIsChecking(false);
    }
  };

  const downloadUpdate = async () => {
    if (!hasIpc || !updateApiRef.current) return;
    setIsDownloading(true);
    setStatus("Iniciando download...");
    try {
      await updateApiRef.current.downloadUpdate();
    } catch (error) {
      console.error("[AutoUpdateSection] downloadUpdate failed", error);
      setStatus("Falha ao iniciar download da atualização.");
      setIsDownloading(false);
    }
  };

  const installUpdate = async () => {
    if (!hasIpc || !updateApiRef.current) return;
    setStatus("Instalando atualização...");
    try {
      await updateApiRef.current.installUpdate();
    } catch (error) {
      console.error("[AutoUpdateSection] installUpdate failed", error);
      setStatus("Falha ao instalar a atualização.");
    }
  };

  return (
    <div className="border rounded-lg bg-card/50 p-5 shadow-sm">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold">Atualizações do Aplicativo</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Verifique e aplique atualizações quando disponíveis. Funciona apenas em builds reais do Electron.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Button onClick={checkForUpdates} disabled={!hasIpc || isChecking}>
            {isChecking ? "A verificar..." : "Verificar agora"}
          </Button>
          <Button onClick={downloadUpdate} disabled={!hasIpc || !updateAvailable || isDownloading}>
            {isDownloading ? "A baixar..." : "Baixar atualização"}
          </Button>
          <Button onClick={installUpdate} disabled={!hasIpc || !hasDownloaded}>
            Instalar agora
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Versão instalada: {appVersion}</p>
          <p>{status}</p>
          {progress !== null && <p>Progresso: {progress}%</p>}
        </div>
      </div>
    </div>
  );
}
