"use client";
import Link from "next/link";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TitleList } from "@/components/common";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from "@/components/ui";
import { InvoiceList } from "./invoice-normal";
import { ProformaList } from "./invoice-proforma";
import { InvoiceReceiptList } from "./invoice-receipt";
import { ReceiptList } from "./receipts";
import { CreditNotesList } from "./credits-notes";
import { cn } from "@/lib";
import { currentStoreStore } from "@/stores";

type DocumentTab =
  | "invoice"
  | "invoice-receipt"
  | "proforma"
  | "receipt"
  | "credit-notes";

export function DocumentList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStore } = currentStoreStore();
  const activeTab = (searchParams.get("tab") as DocumentTab) ?? "invoice";

  const handleTabChange = useCallback(
    (value: DocumentTab | string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-6">
      <TitleList
        title="Documentos"
        suTitle="Crie documentos que ajudaram no controlo das suas atividades"
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Scrollable tabs on mobile */}
          <div className="overflow-x-auto">
            <TabsList className="w-full sm:w-auto inline-flex">
              <TabsTrigger value="invoice" className="whitespace-nowrap">
                Fatura
              </TabsTrigger>
              <TabsTrigger value="invoice-receipt" className="whitespace-nowrap">
                Fatura Recibo
              </TabsTrigger>
              <TabsTrigger value="proforma" className="whitespace-nowrap">
                Fatura Proforma
              </TabsTrigger>
              <TabsTrigger value="receipt" className="whitespace-nowrap">
                Recibos
              </TabsTrigger>
              <TabsTrigger value="credit-notes" className="whitespace-nowrap">
                Notas de Crédito
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Button stacks below on mobile, inline on larger screens */}
          <Link
            className={cn("w-full sm:w-auto", {
              "pointer-events-none cursor-not-allowed": activeTab === "credit-notes",
            })}
            href={`/documents/new-doc?tab=${activeTab}`}
          >
            <Button
              className="w-full sm:w-auto disabled:cursor-not-allowed"
              disabled={activeTab === "credit-notes"}
            >
              Criar Documento
            </Button>
          </Link>
        </div>

        <TabsContent value="invoice">
          <InvoiceList storeId={currentStore?.id} />
        </TabsContent>

        <TabsContent value="proforma">
          <ProformaList storeId={currentStore?.id} />
        </TabsContent>

        <TabsContent value="invoice-receipt">
          <InvoiceReceiptList storeId={currentStore?.id} />
        </TabsContent>

        <TabsContent value="receipt">
          <ReceiptList storeId={currentStore?.id} />
        </TabsContent>

        <TabsContent value="credit-notes">
          <CreditNotesList storeId={currentStore?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
