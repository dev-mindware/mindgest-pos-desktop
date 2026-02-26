"use client";
import { Button, DatePicker } from "@/components/ui";
import { ItemStatus } from "@/types/items";
import { itemsStatusOptions } from "@/constants";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useURLSearchParams } from "@/hooks/common";
import { useClientsFilters } from "@/hooks/entities";

import { cn } from "@/lib";

export function ClientsFiltersTSX({
  children,
  hasData = true
}: {
  children?: React.ReactNode;
  hasData?: boolean;
}) {
  const { filters, setFilters, clearAllFilters } = useClientsFilters();
  const { search, setSearch } = useURLSearchParams("search-client");

  const hasFilter =
    filters.status ||
    filters.sortBy ||
    filters.sortOrder ||
    filters.createdAfter ||
    filters.createdBefore ||
    search.length > 0;

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-4 px-2 sm:px-0",
        !hasData && "pointer-events-none opacity-50"
      )}
    >
      {children && <div className="w-full justify-end sm:w-auto">{children}</div>}
      {/* Search Input and Action Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-baseline">
        <SearchHandlerWrapper
          search={search}
          setSearch={setSearch}
          className="w-full"
        />
        <FilterPopover
          icon="Tag"
          label="Status"
          options={itemsStatusOptions}
          value={filters.status}
          onChange={(status) => setFilters({ status: status as ItemStatus })}
        />

        <FilterPopover
          icon="List"
          label="Ordenar por"
          value={filters.sortBy}
          options={[
            { value: "name", label: "Nome" },
            { value: "createdAt", label: "Mais Recente" },
            { value: "updatedAt", label: "Mais Antigo" },
          ]}
          onChange={(sortBy) => setFilters({ sortBy })}
        />

        <FilterPopover
          label="Ordem"
          icon="ArrowDownUp"
          options={[
            { value: "asc", label: "ASC" },
            { value: "desc", label: "DESC" },
          ]}
          value={filters.sortOrder}
          onChange={(sortOrder) => setFilters({ sortOrder })}
        />
      </div>

      {/* Filters - Grid layout */}
      <div className="flex flex-col sm:flex-row gap-3">

        <DatePicker
          value={
            filters.createdBefore
              ? new Date(filters.createdBefore)
              : undefined
          }
          onChange={(_, formatted) =>
            setFilters({ createdBefore: formatted })
          }
          placeholder="Cadastrado antes de.."
        />

        <DatePicker
          value={
            filters.createdAfter ? new Date(filters.createdAfter) : undefined
          }
          onChange={(_, formatted) => setFilters({ createdAfter: formatted })}
          placeholder="Cadastrado depois de.."
        />
      </div>

      {/* Clear Button */}
      {hasFilter && (
        <div className="flex justify-center sm:justify-start">
          <Button
            size="sm"
            variant="outline"
            onClick={clearAllFilters}
            className="h-10 text-destructive hover:text-destructive w-full sm:w-auto"
          >
            <Icon name="X" className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>
      )}
    </div>
  );
}
