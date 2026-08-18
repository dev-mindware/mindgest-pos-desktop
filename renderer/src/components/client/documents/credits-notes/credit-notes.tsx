"use client";
import {
  CreditNoteFormSkeleton,
  EmptyState,
  RequestError,
  TitleList,
} from "@/components/common";
import { useFetchById } from "@/hooks/common";
import { CreditNoteForm } from "./credfit-notes-form";
import { InvoiceDetails } from "@/types/credit-note";

type CreditNotesProps = {
  invoiceType?: "invoice-receipt" | "invoice-normal";
  invoiceId: string;
};

export function CreditNotes({ invoiceId, invoiceType }: CreditNotesProps) {
  const { data, isLoading, isError, refetch } = useFetchById<InvoiceDetails>(
    "invoice",
    invoiceType === "invoice-receipt" ? "/invoice/invoice-receipt" : "/invoice/normal",
    invoiceId
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TitleList
          title="Notas de Crédito"
          suTitle="Emita notas de crédito para as suas facturas."
        />
        <CreditNoteFormSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <RequestError
        refetch={refetch}
        message="Erro ao carregar dados da factura. Verifique a sua conexão."
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon="FileDiff"
        description="Factura não encontrada ou ID inválido."
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <TitleList
        title="Notas de Crédito"
        suTitle={`Referente à Factura: ${data.invoiceNumber}`}
      />
      <CreditNoteForm invoice={data} />
    </div>
  );
}
