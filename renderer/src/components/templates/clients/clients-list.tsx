"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  ItemStatusBadge,
  EmptyState,
  ButtonOnlyAction,
  DeleteClientModal,
  DetailsClientModal,
  ClientModal,
  Button,
  ClientsFiltersSkeleton,
} from "@/components";
import { ClientResponse } from "@/types";
import { formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { ClientsFiltersTSX } from "./common";
import { useClientActions, useClientsFilters } from "@/hooks/entities";

export function ClientsList() {
  const { search } = useURLSearchParams("search-client");
  const [debounceSearch] = useDebounce(search, 200);
  const { filters, page, setPage } = useClientsFilters();
  const { handlerToggleStatusClient, handlerDetailsClient, handlerEditClient } =
    useClientActions();
  const {
    data: clients,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<ClientResponse>({
    endpoint: "/clients",
    queryKey: ["clients"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const columns: Column<ClientResponse>[] = [
    { key: "name", header: "Nome" },
    { key: "taxNumber", header: "NIF" },
    {
      key: "email",
      header: "Email",
    },
    { key: "phone", header: "Telefone" },
    { key: "address", header: "Endereço" },
    {
      key: "createdAt",
      header: "Criado em",
      render: (_, item) => (
        <div className="text-sm text-foreground">
          {formatDateTime(item.createdAt)}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_, item) => (
        <ItemStatusBadge status={item.isActive ? "ACTIVE" : "INACTIVE"} />
      ),
    },
    {
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            { label: "Ver detalhes", onClick: handlerDetailsClient },
            { label: "Editar", onClick: handlerEditClient },
            {
              label: `${item.isActive ? "Desativar" : "Ativar"}`,
              onClick: () => handlerToggleStatusClient(item),
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="justify-start mt-6 space-y-8">
        <ClientsFiltersSkeleton />
        <ListSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar os clientes" />
    );
  }

  return (
    <div className="mt-6 space-y-8">
      <div className="flex justify-end">

      </div>
      <ClientsFiltersTSX hasData={clients.length > 0}>
      </ClientsFiltersTSX>

      {clients.length > 0 ? (
        <GenericTable<ClientResponse>
          page={page}
          data={clients}
          columns={columns}
          total={total}
          totalPages={totalPages}
          setPage={setPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          emptyMessage="Nenhum cliente encontrado"
        />
      ) : (
        <EmptyState
          description="Adicione novos clientes"
          title="Sem Clientes"
          icon="Users"
        />
      )}

      <DetailsClientModal />
      <DeleteClientModal />
      <ClientModal action="edit" />
    </div>
  );
}
