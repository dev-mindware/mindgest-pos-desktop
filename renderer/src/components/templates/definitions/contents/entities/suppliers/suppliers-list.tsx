"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  EmptyState,
  ButtonOnlyAction,
} from "@/components";
import { useDebounce } from "use-debounce";
import { SupplierFiltersTSX } from "./common";
import {
  SupplierModal,
  DeleteSupplierModal,
  DetailsSupplierModal,
} from "./suppliers-modals";
import { useSupplierActions } from "@/hooks/entities/use-supplier-actions";
import { useSuppliersFilters } from "@/hooks/entities/suppliers-filters";
import { SupplierResponse } from "@/types";

export function SuppliersList() {
  const { search } = useURLSearchParams("search");
  const [debounceSearch] = useDebounce(search, 200);
  const { filters, page, setPage } = useSuppliersFilters();
  const {
    handlerDeleteSupplier,
    handlerDetailsSupplier,
    handlerEditSupplier,
  } = useSupplierActions();

  const {
    data: allSuppliers,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<SupplierResponse>({
    endpoint: "/suppliers",
    queryKey: ["suppliers"],
    queryParams: {
      ...filters,
      search: debounceSearch,
      page,
    },
  });

  const columns: Column<SupplierResponse>[] = [
    { key: "name", header: "Nome" },
    { key: "taxNumber", header: "NIF" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Telefone" },
    {
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            {
              label: "Ver detalhes",
              onClick: () => handlerDetailsSupplier(item),
            },
            { label: "Editar", onClick: () => handlerEditSupplier(item) },
            {
              label: "Deletar",
              onClick: () => handlerDeleteSupplier(item),
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <RequestError
        refetch={refetch}
        message="Erro ao carregar os fornecedores"
      />
    );
  }

  if (allSuppliers.length === 0)
    return (
      <div className="justify-start mt-6 space-y-8">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
            <SupplierFiltersTSX />
          </div>
        </div>
        <EmptyState
          description="Adicione novos fornecedores"
          title="Sem Fornecedores"
          icon="Truck"
        />
      </div>
    );

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <SupplierFiltersTSX />
        </div>
      </div>

      <GenericTable<SupplierResponse>
        page={page}
        data={allSuppliers}
        columns={columns}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        emptyMessage="Nenhum fornecedor encontrado"
      />

      <DetailsSupplierModal />
      <DeleteSupplierModal />
      <SupplierModal action="edit" />
    </div>
  );
}
