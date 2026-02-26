"use client";
import { usePagination } from "@/hooks/common";
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
import { GenerateReceiptModal } from "../modals/generate-receipt-modal";
import { CancelInvoiceModal } from "../modals/cancel-invoice-modal";
import { useRouter } from "next/navigation";
import { useURLSearchParams } from "@/hooks/common";

export function InvoiceList({ storeId }: { storeId?: string }) {
  const router = useRouter();
  const { search } = useURLSearchParams("search_invoice");
  const { filters, page, setPage } = useInvoiceFilters("invoice");
  const [debounceSearch] = useDebounce(search, 200);
  const {
    handlerGenerateReceipt,
    handlerCancelInvoice,
    handlerDetailsInvoice,
  } = useInvoiceActions();
  const {
    data: invoices,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<InvoiceResponse>({
    endpoint: "/invoice/normal",
    queryKey: ["invoice-normal", storeId || ""],
    queryParams: { ...filters, search: debounceSearch, page, storeId },
  });

  const columns: Column<InvoiceResponse>[] = [
    {
      key: "inv-number",
      header: "N° da Fatura",
      render: (_, item) => item.number,
    },
    {
      key: "client",
      header: "Cliente",
      render: (_, item) => item?.client?.name ?? "N/A",
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => `${formatCurrency(item.total)}`,
    },
    {
      key: "items",
      header: "Total de Itens",
      render: (_, item) => item.items.length,
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
              label: "Ver Fatura",
              onClick: handlerDetailsInvoice,
            },

            ...(item.status === "DRAFT"
              ? [
                {
                  label: "Cancelar Fatura",
                  onClick: handlerCancelInvoice,
                },
              ]
              : []),

            ...(item.status !== "PAID"
              ? [
                {
                  label: "Gerar Recibo",
                  onClick: handlerGenerateReceipt,
                },
              ]
              : []),

            ...(item.status === "PAID"
              ? [
                {
                  label: "Emitir Nota",
                  onClick: () => {
                    router.push(`/documents/notes/${item.id}`);
                  },
                },
              ]
              : []),
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
      <RequestError refetch={refetch} message="Erro ao carregar as faturas" />
    );
  }

  return (
    <div className="justify-start mt-6 space-y-8">
      <InvoiceFiltersTSX type="invoice" hasData={invoices.length > 0} />
      {invoices.length > 0 ? (
        <>
          <GenericTable<InvoiceResponse>
            page={page}
            data={invoices}
            columns={columns}
            total={total}
            totalPages={totalPages}
            setPage={setPage}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            emptyMessage="Nenhum gerente encontrado"
          />
        </>
      ) : (
        <div className="justify-start mt-6 space-y-8">
          <EmptyState
            description="Adicione novas facturas"
            title="Sem Facturas"
            icon="FileText"
          />
        </div>
      )}

      {invoices.length !== 0 && (
        <>
          <GenerateReceiptModal />
          <CancelInvoiceModal />
          <InvoicePreviewDrawer type="invoice" />
        </>
      )}
    </div>
  );
}
