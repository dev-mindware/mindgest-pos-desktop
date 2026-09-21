import { BrowserWindow } from "electron";
import { registerSecurityIpcHandlers } from "./security.ipc";
import { registerLanIpcHandlers } from "./lan.ipc";
import { registerHardwareIpcHandlers } from "./hardware.ipc";
import { registerDocumentIpcHandlers } from "./document.ipc";
import { registerFiscalKeysIpcHandlers } from "./fiscal-keys.ipc";
import { registerBackupIpcHandlers } from "./backup.ipc";

type ValidatorFn = (event: Electron.IpcMainInvokeEvent) => boolean;

export function registerAllIpcHandlers(
  validateIpcSender: ValidatorFn,
  getMainWindow: () => BrowserWindow | null
): void {
  registerSecurityIpcHandlers(validateIpcSender);
  registerLanIpcHandlers();
  registerHardwareIpcHandlers(validateIpcSender, getMainWindow);
  registerDocumentIpcHandlers();
  registerFiscalKeysIpcHandlers(validateIpcSender);
  registerBackupIpcHandlers(validateIpcSender);
}

export * from "./security.ipc";
export * from "./lan.ipc";
export * from "./hardware.ipc";
export * from "./document.ipc";
export * from "./fiscal-keys.ipc";
export * from "./backup.ipc";
