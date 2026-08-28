import { ipcMain, Notification, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";
import { PrinterService } from "../printer-service";
import { CustomerDisplayService } from "../customer-display-service";

type ValidatorFn = (event: Electron.IpcMainInvokeEvent) => boolean;

export function registerHardwareIpcHandlers(
  validateIpcSender: ValidatorFn,
  getMainWindow: () => BrowserWindow | null
): void {
  // ==========================================
  // Native Notifications
  // ==========================================
  ipcMain.handle("notification:show", async (event, { title, body, silent }: { title: string; body: string; silent?: boolean }) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    try {
      const iconCandidates = [
        path.join(process.resourcesPath || "", "resources", "icon.png"),
        path.join(__dirname, "..", "resources", "icon.png"),
        path.join(__dirname, "..", "renderer", "public", "mindgest.png"),
      ];

      const foundIcon = iconCandidates.find((p) => fs.existsSync(p));

      const notification = new Notification({
        title: title || "Mindgest POS",
        body: body || "",
        icon: foundIcon,
        silent: silent ?? true,
      });

      notification.on("click", () => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
          if (mainWindow.isMinimized()) mainWindow.restore();
          mainWindow.focus();
        }
      });

      notification.show();
      return true;
    } catch (err) {
      console.error("❌ [Notification] Erro ao disparar notificação nativa:", err);
      return false;
    }
  });

  // ==========================================
  // Hardware & Cash Drawer
  // ==========================================
  ipcMain.handle("printer:open-cash-drawer", async (event, { options, auditEntry }: { options?: any; auditEntry?: any }) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    return await PrinterService.openCashDrawer(options || { transport: 'spooler' }, auditEntry);
  });

  ipcMain.handle("printer:test-connection", async (event, { options }: { options?: any }) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    return await PrinterService.testConnection(options || { transport: 'spooler' });
  });

  ipcMain.handle("printer:get-system-printers", async (event) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    const mainWindow = getMainWindow();
    if (!mainWindow) return [];
    try {
      return await mainWindow.webContents.getPrintersAsync();
    } catch (err) {
      console.warn("Falha ao listar impressoras do sistema:", err);
      return [];
    }
  });

  // ==========================================
  // Customer Display
  // ==========================================
  ipcMain.handle("customer-display:toggle", async (event) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    const port = process.argv[2] || '8888';
    return CustomerDisplayService.toggle(port);
  });

  ipcMain.handle("customer-display:open", async (event) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    const port = process.argv[2] || '8888';
    return CustomerDisplayService.open(port);
  });

  ipcMain.handle("customer-display:close", async (event) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    CustomerDisplayService.close();
    return true;
  });

  ipcMain.handle("customer-display:is-open", async (event) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    return CustomerDisplayService.isOpen();
  });

  ipcMain.handle("customer-display:request-state", async (event) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    return CustomerDisplayService.getState();
  });

  ipcMain.handle("customer-display:update", async (event, partialState: any) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    CustomerDisplayService.updateState(partialState || {});
    return true;
  });

  ipcMain.handle("customer-display:clear", async (event, storeName?: string) => {
    if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
    CustomerDisplayService.clear(storeName);
    return true;
  });
}
