"use client";
import { useDebounce } from "use-debounce";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  EmptyState,
  ButtonOnlyAction,
  CreditNotesFiltersTSX,
  CreditNotePreviewDrawer,
  InvoiceFiltersSkeleton,
} from "@/components";
import { formatCurrency, formatDateTime } from "@/utils";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import { DocumentStatusBadge } from "../common";
import { CreditNotesResponse } from "@/types/credit-note";
import { useCreditNotesActions, useCreditNotesFilters } from "@/hooks";

export function CreditNotesList({ storeId }: { storeId?: string }) {
  const { search } = useURLSearchParams("search-credit-note");
  const [debounceSearch] = useDebounce(search, 200);
  const { filters, page, setPage } = useCreditNotesFilters();
  const { handlerDetailsCreditNote } = useCreditNotesActions();
  const {
    data: creditNotes,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<CreditNotesResponse>({
    endpoint: "/credit-note",
    queryKey: ["credit-notes", storeId || ""],
    queryParams: { ...filters, search: debounceSearch, page, storeId },
  });

  const columns: Column<CreditNotesResponse>[] = [
    {
      key: "number",
      header: "N° da Nota",
      render: (_, item) => item.number,
    },
    {
      key: "invoiceNumber",
      header: "Fatura",
      render: (_, item) => item.invoice.number || "N/A",
    },
    {
      key: "reason",
      header: "Motivo",
      render: (_, item) => <DocumentStatusBadge status={item.reason} />,
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => (
        <span className="text-destructive">
          {formatCurrency(item.invoice.total)}
        </span>
      ),
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
          actions={[{ label: "Ver Nota", onClick: handlerDetailsCreditNote }]}
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
        message="Erro ao carregar notas de crédito"
      />
    );
  }

  return (
    <div className="mt-6 space-y-8">
      <CreditNotesFiltersTSX hasData={creditNotes.length > 0} />
      {creditNotes.length > 0 ? (
        <>
          <GenericTable<CreditNotesResponse>
            page={page}
            total={total}
            columns={columns}
            setPage={setPage}
            data={creditNotes}
            totalPages={totalPages}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            emptyMessage="Nenhuma nota de crédito encontrada"
          />
        </>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="Sem Notas de Crédito"
            description="Nenhuma nota de crédito encontrada"
            icon="FileMinus"
          />
        </div>
      )}
      <CreditNotePreviewDrawer />
    </div>
  );
}
