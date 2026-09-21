import { BrowserWindow } from "electron";

/**
 * Broadcasts an IPC event to all open and valid BrowserWindow instances.
 */
export function broadcastToRenderers(channel: string, payload?: unknown): void {
  try {
    const windows = BrowserWindow.getAllWindows();
    for (const win of windows) {
      if (!win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
        win.webContents.send(channel, payload);
      }
    }
  } catch (error) {
    console.warn(`[broadcastToRenderers] Falha ao emitir evento ${channel}:`, error);
  }
}
