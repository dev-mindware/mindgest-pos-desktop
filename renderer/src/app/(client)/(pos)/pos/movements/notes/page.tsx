"use client";
import { PageWrapper } from "@/components";
import { CreditNotes } from "@/components/client/documents/credits-notes/credit-notes";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CreditNotesContent() {
    const searchParams = useSearchParams();
    const noteId = searchParams.get("noteId") || "";

    return (
        <CreditNotes invoiceId={noteId} />
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
