import { CreditNotes, PageWrapper } from "@/components";

export async function generateStaticParams() {
  return [{ noteId: "preview" }];
}

export default async function POSCreditsNotes({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;

  return (
    <PageWrapper
      routePath="/pos/movements"
      routeLabel="Movimentos de Caixa"
      subRoute="Notas de Crédito"
      showSeparator={true}
    >
      <CreditNotes invoiceId={noteId} />
    </PageWrapper>
  );
}
