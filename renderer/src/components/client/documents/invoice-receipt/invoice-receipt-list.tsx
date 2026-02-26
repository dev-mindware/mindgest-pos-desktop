"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  EmptyState,
  ButtonOnlyAction,
  InvoicePreviewDrawer,
  InvoiceFiltersSkeleton,
} from "@/components";
import { InvoiceResponse } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { DocumentStatusBadge, InvoiceFiltersTSX } from "../common";
import { useInvoiceActions, useInvoiceFilters } from "@/hooks/invoice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { useState } from "react";
import {
  ManagerAuthModal,
  MODAL_MANAGER_AUTH_ID,
} from "@/components/client/pos";
import { useModal } from "@/stores/modal/use-modal-store";

export function InvoiceReceiptList({ storeId }: { storeId?: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { search } = useURLSearchParams("search_invoice-receipt");
  const [debounceSearch] = useDebounce(search, 200);
  const { filters, page, setPage } = useInvoiceFilters("invoice-receipt");
  const { handlerDetailsInvoice } = useInvoiceActions();
  const { openModal } = useModal();

  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const {
    data: invoicesReceipts,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<InvoiceResponse>({
    endpoint: "/invoice/invoice-receipt",
    queryKey: ["invoice-receipt", storeId || ""],
    queryParams: { ...filters, search: debounceSearch, page, storeId },
  });

  const columns: Column<InvoiceResponse>[] = [
    { key: "number", header: "N° da Fatura" },
    {
      key: "client",
      header: "Cliente",
      render: (_, item) => item?.client?.name ?? "N/A",
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => formatCurrency(item.total),
    },
    {
      key: "status",
      header: "Estado",
      render: (_, item) => <DocumentStatusBadge status={item.status} />,
    },
    {
      key: "createdAt",
      header: "Criado em",
      render: (_, item) => formatDateTime(item.createdAt),
    },

    {
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            {
              label: "Ver Factura",
              onClick: handlerDetailsInvoice,
            },
            {
              label: "Emitir Nota",
              onClick: () => {
                const isCashier = user?.role === "CASHIER";
                const route = isCashier
                  ? `/pos/movements/notes/${item.id}`
                  : `/documents/notes/${item.id}?invoiceType=invoice-receipt`;

                if (isCashier) {
                  setPendingRoute(route);
                  openModal(MODAL_MANAGER_AUTH_ID);
                } else {
                  router.push(route);
                }
              },
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="justify-start mt-6 space-y-8">
        <InvoiceFiltersSkeleton />
        <ListSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <RequestError
        refetch={refetch}
        message="Erro ao carregar os documentos"
      />
    );
  }

  return (
    <div className="justify-start mt-6 space-y-8">
      <InvoiceFiltersTSX type="invoice-receipt" hasData={invoicesReceipts.length > 0} />
      {invoicesReceipts.length > 0 ? (
        <>
          <GenericTable<InvoiceResponse>
            page={page}
            data={invoicesReceipts}
            columns={columns}
            total={total}
            totalPages={totalPages}
            setPage={setPage}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            emptyMessage="Nenhum documento encontrado"
          />
        </>
      ) : (
        <div className="justify-start mt-6 space-y-8">
          <EmptyState
            icon="FileText"
            title="Sem Documentos"
            description="Adicione novos documentos"
          />
        </div>
      )}
      <InvoicePreviewDrawer type="invoice-receipt" />
      <ManagerAuthModal
        onAuthenticated={() => {
          if (pendingRoute) router.push(pendingRoute);
        }}
      />
    </div>
  );
}
