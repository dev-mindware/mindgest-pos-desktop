"use client";

import { useModal } from "@/stores/modal/use-modal-store";
import { currentInvoiceStore } from "@/stores/documents";
import { DynamicDrawer } from "./index";
import { InvoiceTemplate } from "./templates/invoice-template";
import { DocumentType } from "@/types/documents";

export function InvoicePreviewDrawer({ type }: { type: DocumentType }) {
  const { open, closeModal } = useModal();
  const { currentInvoice } = currentInvoiceStore();
  const isOpen = open["details-invoice"];

  if (!currentInvoice) return null;

  return (
    <DynamicDrawer
      open={!!isOpen}
      onOpenChange={(val) => !val && closeModal("details-invoice")}
      title="Pré-visualização da Fatura"
      description={`Detalhes da fatura ${currentInvoice.number}`}
    >
      <InvoiceTemplate type={type} data={currentInvoice} />
    </DynamicDrawer>
  );
}
