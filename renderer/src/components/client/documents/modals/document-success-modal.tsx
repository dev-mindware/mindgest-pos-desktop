"use client";

import { useModal } from "@/stores";
import { Button, GlobalModal, Icon } from "@/components";
import { downloadDocument } from "@/services";
import { DocumentType } from "@/types/documents";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useOfflineStore } from "@/stores/offline/offline-store";
import axios from "axios";

interface DocumentSuccessModalData {
    id: string;
    type: DocumentType;
    format?: "pdf" | "thermal";
    payload?: any;
}

export function DocumentSuccessModal() {
    const router = useRouter();
    const { closeModal, open, modalData } = useModal();
    const isOpen = open["document-success"];
    const data = modalData["document-success"] as DocumentSuccessModalData;
    const format = data?.format || "pdf";
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let url: string | null = null;
        const offlineQueue = useOfflineStore.getState().queue;

        async function fetchDocument() {
            if (isOpen && data?.id) {
                setIsLoading(true);
                setError(null);
                try {
                    // Check if document is in the offline queue AND if the user is currently offline
                    const isOffline = !window.navigator.onLine;
                    const offlineDoc = offlineQueue.find(doc => doc.internalId === data.id);

                    const payloadToUse = data.payload || offlineDoc?.payload;
                    if (payloadToUse) {
                        console.log("Gerando documento localmente via microserviço Python (payload disponível)...");
                        // Call local python-microservice
                        const mappedPayload = {
                            format: "pdf",
                            documentType: data.type === "invoice-receipt" ? "INVOICE_RECEIPT" : data.type === "proforma" ? "PROFORMA_INVOICE" : "NORMAL_INVOICE",
                            invoiceNumber: payloadToUse.invoiceNumber || "PENDENTE OFFLINE",
                            invoiceDate: payloadToUse.invoiceDate || new Date().toISOString(),
                            dueDate: payloadToUse.dueDate,
                            company: {
                                name: payloadToUse.company?.name || "A Minha Empresa",
                                taxNumber: payloadToUse.company?.taxNumber || "000000000",
                                address: payloadToUse.company?.address || "Endereço da Empresa",
                                email: payloadToUse.company?.email || "geral@empresa.com",
                                phone: payloadToUse.company?.phone || "900000000"
                            },
                            client: {
                                name: payloadToUse.client?.name || "Consumidor Final",
                                taxNumber: payloadToUse.client?.taxNumber || payloadToUse.client?.nif || "999999999",
                                address: payloadToUse.client?.address,
                                phone: payloadToUse.client?.phone,
                            },
                            items: (payloadToUse.items || []).map((item: any) => ({
                                description: item.name || item.description || "Item",
                                quantity: item.quantity || 1,
                                unitPrice: item.price || item.unitPrice || 0,
                                totalPrice: (item.quantity || 1) * (item.price || item.unitPrice || 0),
                                tax: item.tax || 0
                            })),
                            taxDetails: payloadToUse.taxDetails || [],
                            subtotal: payloadToUse.subtotal || 0,
                            tax: payloadToUse.tax || payloadToUse.taxAmount || 0,
                            total: payloadToUse.total || 0,
                            retentionAmount: payloadToUse.retentionAmount || 0,
                            discountAmount: payloadToUse.discountAmount || 0,
                            notes: payloadToUse.notes,
                            metadata: { layout: format }
                        };

                        const response = await axios.post("http://localhost:3002/generate-document/download", mappedPayload, { responseType: 'blob' });

                        const blob = new Blob([response.data], { type: "application/pdf" });
                        url = window.URL.createObjectURL(blob);
                        setBlobUrl(url);
                    } else {
                        // Standard online behavior
                        const response = await downloadDocument(data.id, data.type, format);
                        const blob = new Blob([response.data], { type: "application/pdf" });
                        url = window.URL.createObjectURL(blob);
                        setBlobUrl(url);
                    }
                } catch (err) {
                    console.error("Erro ao carregar documento para visualização:", err);
                    setError("Não foi possível carregar a visualização do documento.");
                } finally {
                    setIsLoading(false);
                }
            }
        }

        fetchDocument();

        return () => {
            if (url) {
                window.URL.revokeObjectURL(url);
            }
            setBlobUrl(null);
        };
    }, [isOpen, data?.id, data?.type, format]);

    if (!isOpen) return null;

    const handleClose = () => {
        closeModal("document-success");

        if (format === "thermal") return;

        // Map document type to the correct tab in the documents list
        const tabMap: Record<string, string> = {
            invoice: "invoice",
            "invoice-receipt": "invoice-receipt",
            proforma: "proforma",
            receipt: "receipt",
            "credit-note": "credit-notes",
        };

        const tab = tabMap[data.type] || "invoice";
        router.push(`/documents?tab=${tab}&newId=${data.id}`);
    };

    const isThermal = format === "thermal";

    return (
        <GlobalModal
            id="document-success"
            canClose
            title="Documento Criado!"
            description={isThermal ? "Visualize abaixo o talão do seu documento." : "Visualize abaixo a versão A4 do seu documento."}
            className={isThermal ? "max-w-md max-h-[90vh] overflow-y-auto" : "max-w-4xl max-h-[90vh] overflow-y-auto"}
        >
            <div className="flex flex-col gap-4 mt-4">
                <div className={isThermal ? "relative w-full aspect-[1/2] bg-muted rounded-test-lg border overflow-hidden" : "relative w-full aspect-[1/1.4] bg-muted rounded-test-lg border overflow-hidden"}>
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-10 text-center">
                            <Skeleton className="w-full h-full" />
                            <div className="absolute flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-test-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="text-sm text-muted-foreground">Carregando visualização...</p>
                            </div>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center gap-4">
                            <Icon name="FileWarning" className="h-12 w-12 text-destructive" />
                            <p className="text-sm font-medium text-destructive">{error}</p>
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                Tentar Novamente
                            </Button>
                        </div>
                    )}

                    {blobUrl && !isLoading && (
                        <iframe
                            src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full border-none"
                            title="Visualização do Documento"
                        />
                    )}
                </div>

                <div className="flex justify-between items-center px-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        {isThermal ? "Versão Talão" : "Versão A4"}
                    </p>
                    <Button
                        onClick={handleClose}
                        variant="default"
                        className="w-32"
                    >
                        Fechar
                    </Button>
                </div>
            </div>
        </GlobalModal>
    );
}
