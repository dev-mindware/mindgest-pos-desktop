"use client";
import { Button } from "@/components/ui";
import { FilterPopover } from "@/components/shared";
import { useURLSearchParams } from "@/hooks/common";
import { usersByOption, categoryStatusOptions } from "@/constants";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { useSuppliersFilters } from "@/hooks/entities/suppliers-filters";

export function SupplierFiltersTSX() {
  const { search, setSearch } = useURLSearchParams("search");
  const { filters, setFilters } = useSuppliersFilters();

  const hasFilter =
    filters.status || filters.sortBy || filters.sortOrder || (search && search.length > 0);

  return (
    <SearchHandlerWrapper
      search={search || ""}
      setSearch={setSearch}
      className="flex flex-col sm:flex-row"
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-2">
        <FilterPopover
          icon="Tag"
          label="NIF"
          options={[]}
          value={filters.status}
          onChange={(status) => setFilters({ status })}
        />

        <FilterPopover
          icon="List"
          label="Ordenar por"
          options={usersByOption}
          value={filters.sortBy}
          onChange={(sortBy) => setFilters({ sortBy })}
        />

        <FilterPopover
          label="Sortear por"
          icon="ArrowDownUp"
          options={[
            { value: "asc", label: "ASC" },
            { value: "desc", label: "DESC" },
          ]}
          value={filters.sortOrder}
          onChange={(sortOrder) => setFilters({ sortOrder })}
        />
      </div>
    </SearchHandlerWrapper>
  );
}
