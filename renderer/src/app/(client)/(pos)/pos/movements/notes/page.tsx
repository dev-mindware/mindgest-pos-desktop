"use client";
import { PageWrapper } from "@/components";
import { CreditNotes } from "@/components/client/documents/credits-notes/credit-notes";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CreditNotesContent() {
    const searchParams = useSearchParams();
    const noteId = searchParams.get("noteId") || "";
    const invoiceType = (searchParams.get("invoiceType") as "invoice-receipt" | "invoice-normal") || undefined;

    return (
        <CreditNotes invoiceId={noteId} invoiceType={invoiceType} />
    );
}

export default function POSCreditsNotes() {
    return (
        <PageWrapper
            routePath="/pos/movements"
            routeLabel="Movimentos de Caixa"
            subRoute="Notas de Crédito"
            showSeparator={true}
        >
            <Suspense fallback={<div>Carregando...</div>}>
                <CreditNotesContent />
            </Suspense>
        </PageWrapper>
    );
}
