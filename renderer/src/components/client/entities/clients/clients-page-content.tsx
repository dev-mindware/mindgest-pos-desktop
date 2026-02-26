"use client";
import { TitleList } from "@/components/common";
import { ButtonAddClient, ClientModal, ClientsList } from "@/components";

export function ClientsPageContent() {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <TitleList title="Clientes" suTitle="Adicione e gerencie seus clientes" />
        <ButtonAddClient />
      </div>
      <ClientsList />
      <ClientModal action="add" />
    </> 
  );
}
