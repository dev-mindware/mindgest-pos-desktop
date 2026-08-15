import { api } from "./api";
import type { DownloadType } from "@/types";
import type { DocumentType } from "@/types/documents";

const DOCUMENT_BASE_PATH: Record<DocumentType, string> = {
  invoice: "/invoice/normal",
  proforma: "/invoice/proforma",
  receipt: "/invoice/receipt",
  "invoice-receipt": "/invoice/invoice-receipt",
  "credit-note": "/credit-note",
};

function base64ToBlob(base64: string, contentType = "application/pdf"): Blob {
  const byteCharacters = atob(base64);
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays as any, { type: contentType });
}

export async function downloadDocument(
  id: string,
  documentType: DocumentType,
  format: DownloadType,
) {
  const isLocalStorageId = id.includes("-") && id.length > 20; // Primitive UUID check
  const isOffline = typeof window !== "undefined" && !window.navigator.onLine;
  const hasIpcDocument = typeof window !== "undefined" && !!(window as any).ipc?.document?.generateLocalPdf;

  // 1. Se estiver Offline ou for documento criado localmente, gerar via microserviço Desktop
  if ((isOffline || isLocalStorageId) && hasIpcDocument) {
    console.log("🖨️ [DownloadService] Modo Offline/Local detectado. Gerando PDF via microserviço local...");
    try {
      const layout = format === "thermal" ? "thermal" : "a4";
      const localResult = await (window as any).ipc.document.generateLocalPdf({
        invoiceId: id,
        layout,
      });

      if (localResult?.base64) {
        const blob = base64ToBlob(localResult.base64, "application/pdf");
        return { data: blob, headers: { "content-type": "application/pdf" }, status: 200 };
      }
    } catch (localError: any) {
      console.warn("⚠️ [DownloadService] Falha no gerador local:", localError?.message || localError);
      if (isOffline) throw localError;
    }
  }

  // 2. Se estiver Online, tentar consumir a Cloud API
  try {
    const basePath = DOCUMENT_BASE_PATH[documentType];
    return await api.get(`${basePath}/${id}/download-${format}`, {
      responseType: "blob",
    });
  } catch (onlineError: any) {
    // 3. Fallback: Se a Cloud falhar por erro de rede (offline momentâneo), tentar o local
    if (!onlineError.response && hasIpcDocument) {
      console.log("🔄 [DownloadService] Cloud inacessível. Executando fallback para o microserviço local...");
      const layout = format === "thermal" ? "thermal" : "a4";
      const localResult = await (window as any).ipc.document.generateLocalPdf({
        invoiceId: id,
        layout,
      });

      if (localResult?.base64) {
        const blob = base64ToBlob(localResult.base64, "application/pdf");
        return { data: blob, headers: { "content-type": "application/pdf" }, status: 200 };
      }
    }
    throw onlineError;
  }
}
