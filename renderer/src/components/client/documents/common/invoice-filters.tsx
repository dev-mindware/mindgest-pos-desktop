"use client";

import { Button, DatePicker, Input } from "@/components/ui";
import { invoiceByOption, invoiceStatusOptions } from "@/constants";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useInvoiceFilters, useURLSearchParams } from "@/hooks";
import { InvoiceStatus } from "@/types";
import { cn } from "@/lib";

type InvoiceType = "invoice" | "proforma" | "invoice-receipt" | "receipt";

type Props = {
  type: InvoiceType;
  hasData: boolean;
};

export function InvoiceFiltersTSX({ type, hasData }: Props) {
  const prefix = type;
  const { filters, setFilters, clearAllFilters } = useInvoiceFilters(prefix);
  const { search, setSearch } = useURLSearchParams(`search_${prefix}`);

  const hasFilter =
    !!filters.status ||
    !!filters.sortBy ||
    !!filters.sortOrder ||
    !!filters.invoiceNumber ||
    !!filters.clientName ||
    !!filters.startDate ||
    !!filters.endDate ||
    search.length > 0;

  const showStatusFilter = type === "invoice";

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-4 px-2 sm:px-0",
        !hasData && "pointer-events-none opacity-50"
      )}
    >
      {/* Search Input and Filter Popovers */}
      <div className="w-full flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SearchHandlerWrapper
            search={search}
            setSearch={setSearch}
            className="w-full"
            placeholder="Pesquise por cliente ou nº da Factura"
          />
          <Input
            type="search"
            placeholder="Cliente"
            value={filters.clientName ?? ""}
            onChange={(e) => setFilters({ clientName: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Filter Popovers - Full width on mobile, auto width on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {showStatusFilter && (
            <FilterPopover
              icon="Tag"
              label="Status"
              value={filters.status}
              options={invoiceStatusOptions}
              onChange={(status) =>
                setFilters({ status: status as InvoiceStatus })
              }
            />
          )}

          <FilterPopover
            icon="List"
            label="Ordenar por"
            options={invoiceByOption}
            value={filters.sortBy}
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
          <Input
            type="search"
            placeholder="Nº Fatura"
            value={filters.invoiceNumber ?? ""}
            onChange={(e) => setFilters({ invoiceNumber: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      {/* Date Pickers and Clear Button - 3 columns on desktop */}
      <div className="flex justify-center sm:justify-start">
        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            value={filters.startDate ? new Date(filters.startDate) : undefined}
            onChange={(_, formatted) => setFilters({ startDate: formatted })}
            placeholder="Data Início"
          />

          <DatePicker
            value={filters.endDate ? new Date(filters.endDate) : undefined}
            onChange={(_, formatted) => setFilters({ endDate: formatted })}
            placeholder="Data Fim"
          />
        </div>

        {/* Clear Button */}
        {hasFilter && (
          <Button
            size="sm"
            variant="outline"
            onClick={clearAllFilters}
            className="h-10 text-destructive hover:text-destructive w-full whitespace-nowrap"
          >
            <Icon name="X" className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}