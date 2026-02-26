"use client";
import { Button, DatePicker } from "@/components/ui";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useURLSearchParams } from "@/hooks/common";
import { useCashSessionFilters } from "@/hooks/entities";
import { cn } from "@/lib/utils";

export function PosFilters({
    hasData = true
}: {
    hasData?: boolean;
}) {
    const { filters, setFilters, clearAllFilters } = useCashSessionFilters();
    const { search, setSearch } = useURLSearchParams("search");

    const hasFilter =
        filters.isOpen ||
        filters.sortBy ||
        filters.sortOrder ||
        filters.openedAfter ||
        filters.openedBefore ||
        (search && search.length > 0);

    return (
        <div
            className={cn(
                "w-full flex flex-col gap-4",
                !hasData && !hasFilter && "pointer-events-none opacity-50"
            )}
        >
            <div className="flex flex-col lg:flex-row gap-4 items-baseline">
                <SearchHandlerWrapper
                    search={search || ""}
                    setSearch={setSearch}
                    className="w-full lg:max-w-[400px]"
                />
                    <FilterPopover
                        icon="Tag"
                        label="Estado"
                        options={[
                            { value: "true", label: "Aberto" },
                            { value: "false", label: "Fechado" },
                        ]}
                        value={filters.isOpen === null || filters.isOpen === undefined ? undefined : filters.isOpen.toString()}
                        onChange={(isOpen) => setFilters({ isOpen: isOpen as string })}
                    />

                    <FilterPopover
                        icon="List"
                        label="Ordenar por"
                        value={filters.sortBy || undefined}
                        options={[
                            { value: "openedAt", label: "Data de Abertura" },
                            { value: "totalSales", label: "Vendas Totais" },
                            { value: "openingCash", label: "Capital Inicial" },
                        ]}
                        onChange={(sortBy) => setFilters({ sortBy })}
                    />

                    <FilterPopover
                        label="Ordem"
                        icon="ArrowDownUp"
                        options={[
                            { value: "asc", label: "Crescente" },
                            { value: "desc", label: "Decrescente" },
                        ]}
                        value={filters.sortOrder || undefined}
                        onChange={(sortOrder) => setFilters({ sortOrder })}
                    />

                    <DatePicker
                    value={
                        filters.openedAfter
                            ? new Date(filters.openedAfter)
                            : undefined
                    }
                    onChange={(_, formatted) =>
                        setFilters({ openedAfter: formatted })
                    }
                    placeholder="Aberto depois de.."
                />

                <DatePicker
                    value={
                        filters.openedBefore ? new Date(filters.openedBefore) : undefined
                    }
                    onChange={(_, formatted) => setFilters({ openedBefore: formatted })}
                    placeholder="Aberto antes de.."
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                {hasFilter && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={clearAllFilters}
                        className="h-10 text-destructive hover:text-destructive px-4"
                    >
                        <Icon name="X" className="w-4 h-4 mr-2" />
                        Limpar Filtros
                    </Button>
                )}
            </div>
        </div>
    );
}
