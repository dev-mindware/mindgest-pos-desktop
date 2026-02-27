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

import axios from "axios";

export async function downloadDocument(
  id: string,
  documentType: DocumentType,
  format: DownloadType,
) {
  const isLocalStorageId = id.includes("-") && id.length > 20; // Primitive UUID check
  const isOffline = typeof window !== "undefined" && !window.navigator.onLine;

  if (isOffline || isLocalStorageId) {
    // Redirect to local python-microservice
    console.log(
      "Offline or local ID detected, redirecting to local microservice...",
    );

    // We need to fetch the pending document data from the store if possible,
    // but services don't easily access hooks.
    // However, the python-microservice /generate-document/download expects a full GenerateDocumentRequest.
    // This redirection might be more complex than just a URL change because the local service
    // needs the DATA, not just an ID, since it doesn't have the database.

    // Alternative: The DocumentSuccessModal should handle the choice of service.
  }

  const basePath = DOCUMENT_BASE_PATH[documentType];

  return api.get(`${basePath}/${id}/download-${format}`, {
    responseType: "blob",
  });
}
