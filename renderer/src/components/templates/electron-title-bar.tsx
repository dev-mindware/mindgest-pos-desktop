"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/common";

export function ElectronTitleBar() {
  const [isElectron, setIsElectron] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const runningInElectron = Boolean(window.ipc?.window);
    setIsElectron(runningInElectron);

    if (!runningInElectron) return;

    document.documentElement.classList.add("electron-shell");
    window.ipc.window.isMaximized().then(setIsMaximized);
    const removeMaximizedListener = window.ipc.window.onMaximizedChange(setIsMaximized);

    return () => {
      removeMaximizedListener();
      document.documentElement.classList.remove("electron-shell");
    };
  }, []);

  if (!isElectron) return null;

  return (
    <header className="electron-title-bar" aria-label="MindGest POS">
      <div className="electron-title-bar__brand">
        <img src="/mindgest.png" alt="" className="electron-title-bar__logo" />
        <span className="electron-title-bar__name">MindGest POS</span>
        <span className="electron-title-bar__edition">Desktop</span>
      </div>
      <div className="electron-title-bar__controls">
        <button
          type="button"
          className="electron-title-bar__control"
          onClick={() => window.ipc.window.minimize()}
          aria-label="Minimizar"
          title="Minimizar"
        >
          <Icon name="Minus" className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="electron-title-bar__control"
          onClick={() => window.ipc.window.toggleMaximize()}
          aria-label={isMaximized ? "Restaurar" : "Maximizar"}
          title={isMaximized ? "Restaurar" : "Maximizar"}
        >
          <Icon name={isMaximized ? "Minimize2" : "Maximize2"} className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="electron-title-bar__control electron-title-bar__control--close"
          onClick={() => window.ipc.window.close()}
          aria-label="Fechar"
          title="Fechar"
        >
          <Icon name="X" className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
