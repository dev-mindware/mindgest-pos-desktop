"use client";
import {
  CreditNoteFormSkeleton,
  EmptyState,
  RequestError,
  TitleList,
} from "@/components/common";
import { useFetchById } from "@/hooks/common";
import { InvoiceDetails } from "@/types/credit-note";
import { ProformaForm } from "./proforma-form";
import { useRouter } from "next/navigation";

export function ProformaEditContent({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useFetchById<InvoiceDetails>(
    "invoice-proforma",
    "/invoice/proforma",
    invoiceId
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TitleList
          title="Editar Proforma"
          suTitle="Edite a proforma para as suas faturas."
        />
        <CreditNoteFormSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <RequestError
        refetch={refetch}
        message="Erro ao carregar dados da fatura. Verifique a sua conexão."
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon="FileDiff"
        description="Fatura não encontrada ou ID inválido."
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <TitleList
        title="Editar Proforma"
        suTitle={`Referente à Proforma: ${data.id.slice(-8)}`} // Melhora o contexto para o usuário
      />

      <ProformaForm
        action="edit"
        id={invoiceId}
        initialData={data}
        onSuccess={() => {
          router.replace("/documents?tab=proforma");
        }}
      />
    </div>
  );
}
