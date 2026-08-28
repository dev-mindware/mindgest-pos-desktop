import { ipcMain } from "electron";
import { LocalDocumentService } from "../document-service";
import { SidecarManager } from "../sidecar-manager";

export function registerDocumentIpcHandlers(): void {
  ipcMain.handle("document:generate-local-pdf", async (_, { invoiceId, layout }: { invoiceId: string; layout?: 'a4' | 'thermal' }) => {
    try {
      return await LocalDocumentService.generateInvoicePdf(invoiceId, { layout });
    } catch (error: any) {
      console.error("❌ [IPC document:generate-local-pdf] Erro ao gerar PDF local:", error);
      throw error;
    }
  });

  ipcMain.handle("document:is-sidecar-healthy", async () => {
    return await SidecarManager.isHealthy();
  });
}
