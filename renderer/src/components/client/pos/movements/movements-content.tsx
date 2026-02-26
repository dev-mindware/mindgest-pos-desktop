"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TitleList,
  InvoiceReceiptList,
  CreditNotesList,
} from "@/components";
import { ProformaList } from "@/components/client/documents/invoice-proforma/proforma-list";

export function MovementsContent() {
  const { user } = useAuth();
  const storeId = user?.store?.id;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <TitleList
          title="Movimentos de Caixa"
          suTitle="Gerencie faturas-recibo e notas de crédito emitidas nesta loja."
        />
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full max-w-[600px] grid-cols-3">
          <TabsTrigger value="invoices">Faturas-Recibo</TabsTrigger>
          <TabsTrigger value="proformas">Faturas Proforma</TabsTrigger>
          <TabsTrigger value="notes">Notas de Crédito</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="mt-6">
          <InvoiceReceiptList storeId={storeId} />
        </TabsContent>
        <TabsContent value="proformas" className="mt-6">
          <ProformaList storeId={storeId} />
        </TabsContent>
        <TabsContent value="notes" className="mt-6">
          <CreditNotesList storeId={storeId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
