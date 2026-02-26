"use client";
import { useCallback, useState } from "react";
import { TitleList } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { InvoiceForm } from "./invoice-normal";
import { InvoiceReceiptForm } from "./invoice-receipt";
import { ProformaForm } from "./invoice-proforma";
import { DocumentSuccessModal } from "./modals/document-success-modal";

type TabsAloweds = "invoice" | "invoice-receipt" | "proforma";

export function AddDocuments() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current_Tab = useSearchParams().get("tab");
  const [currentTab, setCurrentTab] = useState<TabsAloweds>(() => {
    if (current_Tab) {
      return current_Tab as TabsAloweds;
    }
    return "invoice";
  });

  const handleTabChange = useCallback(
    (value: TabsAloweds | string) => {
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
        suTitle="Crie documentos que ajudaram no controlo das suas atividades."
      />

      <Tabs
        className="w-full"
        defaultValue={currentTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="flex justify-center md:justify-start">
          <TabsTrigger value="invoice">Fatura</TabsTrigger>
          <TabsTrigger value="invoice-receipt">Fatura Recibo</TabsTrigger>
          <TabsTrigger value="proforma">Fatura Proforma</TabsTrigger>
        </TabsList>

        <TabsContent value="invoice">
          <InvoiceForm />
        </TabsContent>
        <TabsContent value="invoice-receipt">
          <InvoiceReceiptForm />
        </TabsContent>
        <TabsContent value="proforma">
          <ProformaForm />
        </TabsContent>
      </Tabs>

      <DocumentSuccessModal />
    </div>
  );
}
