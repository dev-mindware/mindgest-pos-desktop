"use client";
import { usePagination } from "@/hooks/common";
import {
    Column,
    RequestError,
    GenericTable,
    ListSkeleton,
    EmptyState,
    ButtonOnlyAction,
    InvoiceFiltersSkeleton,
    Button,
} from "@/components";
import { Bank } from "@/types";
import { formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { useURLSearchParams } from "@/hooks/common";
import { useBanksActions } from "@/hooks/banks";
import { useBankFilters } from "@/hooks/banks";
import { BanksFilters } from "./banks-filters";
import { BankModal, DeleteBankModal, BankDetailsModal } from "./banks-modals";
import { useModal } from "@/stores";

export function BankList() {
    const { openModal } = useModal();
    const { search } = useURLSearchParams("search_bank");
    const { page, setPage } = useBankFilters("bank");
    const [debounceSearch] = useDebounce(search, 200);
    const {
        handlerDeletebank,
        handlerDetailsBank,
        handlerEditBank,
    } = useBanksActions();
    const {
        data: banks,
        total,
        totalPages,
        goToNextPage,
        goToPreviousPage,
        isLoading,
        isError,
        refetch,
    } = usePagination<Bank>({
        endpoint: "/bank-accounts",
        queryKey: ["bank-accounts"],
        queryParams: { search: debounceSearch, page },
    });

    const columns: Column<Bank>[] = [
        {
            key: "bankName",
            header: "Nome do Banco",
            render: (_, item) => item.bankName,
        },
        {
            key: "accountNumber",
            header: "Número da Conta",
            render: (_, item) => item.accountNumber,
        },
        {
            key: "iban",
            header: "IBAN",
            render: (_, item) => item.iban,
        },
        {
            key: "express",
            header: "Express",
            render: (_, item) => item.phone,
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
                            label: "Ver Detalhes",
                            onClick: handlerDetailsBank,
                        },
                        {
                            label: "Editar",
                            onClick: handlerEditBank,
                        },
                        {
                            type: "separator",
                        },
                        {
                            label: "Remover",
                            onClick: handlerDeletebank,
                            variant: "destructive",
                        },
                    ]}
                />
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="justify-start mt-6 space-y-8">
                <ListSkeleton />
            </div>
        );
    }

    if (isError) {
        return (
            <RequestError refetch={refetch} message="Erro ao carregar os bancos" />
        );
    }

    return (
        <div className="justify-start mt-6 space-y-8">
            <div className="flex items-center justify-between">
                <BanksFilters />

                <Button
                    onClick={() => openModal("add-bank")}
                    variant="default"
                    className="w-full sm:w-auto text-sm sm:text-base"
                >
                    Adicionar IBAN
                </Button>

            </div>

            {banks.length > 0 ? (
                <>
                    <GenericTable<Bank>
                        page={page}
                        data={banks}
                        columns={columns}
                        total={total}
                        totalPages={totalPages}
                        setPage={setPage}
                        goToNextPage={goToNextPage}
                        goToPreviousPage={goToPreviousPage}
                        emptyMessage="Nenhum banco encontrado"
                    />
                </>
            ) : (
                <div className="justify-start mt-6 space-y-8">
                    <EmptyState
                        description="Adicione novo banco"
                        title="Sem nenhum banco"
                        icon="FileText"
                    />
                </div>
            )}

            <BankModal action="add" />
            <BankModal action="edit" />
            <DeleteBankModal />
            <BankDetailsModal />
        </div>
    );
}
