"use client";

import { useState, useEffect, useCallback } from "react";
import CreatableSelect from "react-select/creatable";
import { api } from "@/services/api";
import { useDebounce } from "use-debounce";
import { components, MenuListProps } from "react-select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Option {
  value: string | number;
  label: string;
  data?: any;
  __isNew__?: boolean;
}

interface AsyncCreatableSelectProps {
  endpoint: string;
  label: string;
  placeholder?: string;
  value: Option | null;
  onChange: (option: Option | null) => void;
  displayFields?: string[];
  minChars?: number;
  formatCreateLabel?: (inputValue: string) => string;
  className?: string;
  error?: string;
  inputId?: string;
}

export function AsyncCreatableSelectField({
  endpoint,
  label,
  placeholder = "Digite para buscar...",
  value,
  onChange,
  displayFields = ["name"],
  minChars = 1,
  formatCreateLabel = (inputValue) => `Criar "${inputValue}"`,
  className,
  error,
  inputId,
}: AsyncCreatableSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch] = useDebounce(inputValue, 300);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [options, setOptions] = useState<Option[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Stable serialization of displayFields to prevent unnecessary re-renders
  // when the parent passes a new array literal on every render.
  const displayFieldsKey = displayFields.join(",");

  const fetchOptions = useCallback(
    async (search: string, currentPage: number) => {
      if (search.length > 0 && search.length < minChars) {
        setOptions([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await api.get(endpoint, {
          params: {
            search: search || undefined,
            page: currentPage,
            limit: 5,
          },
        });

        const raw = response.data;
        const data = Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw)
            ? raw
            : [];

        const meta = raw?.meta || {};
        const totalCount = meta.total ?? raw?.total ?? 0;
        const calculatedTotalPages =
          meta.totalPages ||
          meta.total_pages ||
          raw?.totalPages ||
          raw?.total_pages ||
          (totalCount ? Math.ceil(totalCount / 5) : 1);

        setTotalPages(calculatedTotalPages);
        setTotal(totalCount);

        const fields = displayFieldsKey.split(",");
        const mappedOptions = data.map((item: any) => ({
          value: item.id,
          label: fields
            .map((field) => getNestedValue(item, field))
            .filter(Boolean)
            .join(" - "),
          data: item,
        }));

        setOptions(mappedOptions);
      } catch (error) {
        console.error("Erro ao buscar opções:", error);
        setOptions([]);
      } finally {
        setIsSearching(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint, displayFieldsKey, minChars]
  );

  // Only fetch on mount (initial load) or when the user explicitly interacts
  // (search term changes or page changes). Changing `fetchOptions` identity
  // alone (due to parent re-render) should NOT trigger a new fetch.
  const isFirstRender = useState(true);
  useEffect(() => {
    if (isFirstRender[0]) {
      isFirstRender[1](false);
      fetchOptions("", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when the user types (debouncedSearch changes)
  useEffect(() => {
    if (isFirstRender[0]) return; // skip during mount — handled above
    fetchOptions(debouncedSearch, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const handleCreate = (inputValue: string) => {
    const newOption: Option = {
      value: inputValue,
      label: inputValue,
      __isNew__: true,
    };
    onChange(newOption);
  };

  const Menu = (props: any) => {
    return (
      <components.Menu {...props}>
        <div className="relative">
          {props.children}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-2 border-t bg-card rounded-b-[var(--radius)]">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (page > 1) setPage(page - 1);
                }}
                disabled={page <= 1 || isSearching}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground font-medium">
                {page} / {totalPages}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (page < totalPages) setPage(page + 1);
                }}
                disabled={page >= totalPages || isSearching}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </components.Menu>
    );
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>

      <CreatableSelect
        inputValue={inputValue}
        options={options}
        value={value}
        onInputChange={(val, { action }) => {
          if (
            action === "input-change" ||
            action === "set-value" ||
            action === "menu-close" ||
            action === "input-blur"
          ) {
            setInputValue(val);
          }
        }}
        onChange={(newValue) => {
          onChange(newValue as Option | null);
          // Optional: clear input on selection to keep it clean for next focus
          // setInputValue(""); 
        }}
        onCreateOption={handleCreate}
        placeholder={placeholder}
        isLoading={isSearching}
        formatCreateLabel={formatCreateLabel}
        inputId={inputId}
        noOptionsMessage={({ inputValue }) => {
          if (inputValue.length > 0 && inputValue.length < minChars) {
            return `Digite pelo menos ${minChars} caracteres`;
          }
          return "Nenhum resultado encontrado";
        }}
        loadingMessage={() => "Buscando..."}
        isClearable
        filterOption={() => true}
        components={{ Menu }}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "37px",
            height: "37px",
            borderRadius: "6.5px",
            borderColor: error
              ? "var(--destructive)"
              : state.isFocused
                ? "var(--ring)"
                : "var(--border)",
            backgroundColor: "var(--background)",
            boxShadow: state.isFocused
              ? error
                ? "0 0 0 1px var(--destructive)"
                : "0 0 0 1px var(--ring)"
              : "none",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: error ? "var(--destructive)" : "var(--ring)",
            },
          }),

          valueContainer: (base) => ({
            ...base,
            padding: "0 12px",
          }),

          input: (base) => ({
            ...base,
            color: "var(--foreground)",
          }),

          placeholder: (base) => ({
            ...base,
            color: "var(--muted-foreground)",
          }),

          singleValue: (base) => ({
            ...base,
            color: "var(--foreground)",
          }),

          menu: (base) => ({
            ...base,
            borderRadius: "var(--radius)",
            backgroundColor: "var(--card)",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
            zIndex: 9999,
          }),

          menuList: (base) => ({
            ...base,
            padding: "4px",
            maxHeight: "300px",
          }),

          option: (base, state) => ({
            ...base,
            borderRadius: "var(--radius-sm)",
            backgroundColor: state.isSelected
              ? "var(--primary)"
              : state.isFocused
                ? "var(--accent)"
                : "transparent",
            color: state.isSelected
              ? "var(--primary-foreground)"
              : "var(--foreground)",
            cursor: "pointer",
            padding: "10px 12px",
            ":active": {
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            },
          }),

          dropdownIndicator: (base, state) => ({
            ...base,
            color: "var(--muted-foreground)",
            ":hover": {
              color: "var(--foreground)",
            },
          }),

          clearIndicator: (base) => ({
            ...base,
            color: "var(--muted-foreground)",
            ":hover": {
              color: "var(--foreground)",
            },
          }),

          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: "var(--border)",
          }),

          loadingIndicator: (base) => ({
            ...base,
            color: "var(--primary)",
          }),

          noOptionsMessage: (base) => ({
            ...base,
            color: "var(--muted-foreground)",
          }),
        }}
        className="react-select-container"
        classNamePrefix="react-select"
      />

      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      {value?.__isNew__ && (
        <p className="mt-1 text-sm text-amber-600">
          ⚠️ Novo registro - preencha os dados adicionais
        </p>
      )}
    </div>
  );
}
