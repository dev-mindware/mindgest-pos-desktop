import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { icons } from "lucide-react";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

interface InputFetchProps {
  startIcon?: keyof typeof icons;
  label: string;
  endpoint: string;
  displayFields?: string[];
  onValueChange?: (value: string | number, fullObject?: Option | null) => void;
  placeholder?: string;
  debounceMs?: number;
  minChars?: number;
  value?: string;
}

interface Option {
  id: number | string;
  [key: string]: any;
}

export const InputFetch = forwardRef<HTMLInputElement, InputFetchProps>(({
  startIcon: StartIcon,
  label,
  endpoint,
  displayFields = ["name"],
  onValueChange,
  placeholder = "Digite para buscar...",
  debounceMs = 300,
  minChars = 2,
  value: propValue, // Rename to avoid conflict
}, ref) => {
  const [inputValue, setInputValue] = useState(propValue || "");
  const [debouncedValue] = useDebounce(inputValue, debounceMs);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const internalRef = useRef<HTMLInputElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const listboxId = useRef(`listbox-${Math.random().toString(36).substring(2, 9)}`).current;
  useImperativeHandle(ref, () => internalRef.current!);

  useEffect(() => {
    if (propValue !== undefined) {
      setInputValue(propValue);
      if (propValue === "") {
        setSelectedOption(null);
      }
    }
  }, [propValue]);

  const {
    data: options = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["input-fetch", endpoint, debouncedValue],
    queryFn: async () => {
      if (debouncedValue.trim().length < minChars) return [];

      const response = await api.get(
        `${endpoint}?search=${encodeURIComponent(debouncedValue)}`
      );
      const responseData = response.data;

      let results = [];
      if (responseData && typeof responseData === "object") {
        if (Array.isArray(responseData.data)) {
          results = responseData.data;
        } else if (Array.isArray(responseData)) {
          results = responseData;
        }
      }

      console.log(`✅ ${results.length} resultados encontrados:`, results);
      return results;
    },
    enabled: debouncedValue.trim().length >= minChars,
    staleTime: 1000 * 60 * 5,
  });

  // Abre o dropdown quando houver resultados e o input tiver foco
  useEffect(() => {
    if (options.length > 0 && inputValue.trim().length >= minChars) {
      setIsOpen(true);
      setHighlightedIndex(0);
    } else if (!loading && inputValue.trim().length >= minChars) {
      setIsOpen(true);
      setHighlightedIndex(-1);
    }
  }, [options, inputValue, minChars, loading]);

  // Efeito para scroll automático do item destacado
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsContainerRef.current) {
      const activeEl = optionsContainerRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setHighlightedIndex(0);

    // Se o usuário está digitando algo diferente da seleção, limpa a seleção
    if (selectedOption) {
      setSelectedOption(null);
      console.log("🔄 Seleção limpa - usuário está digitando novamente");
    }

    // O valor digitado é sempre notificado ao componente pai
    if (onValueChange) {
      onValueChange(value, null);
    }
  };

  const handleSelectOption = (option: Option) => {
    const displayText = displayFields
      .map((field) => getNestedValue(option, field))
      .filter(Boolean)
      .join(" - ");

    setInputValue(displayText);
    setSelectedOption(option);
    setIsOpen(false);

    if (onValueChange) {
      onValueChange(option.id, option);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (isOpen) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      if (!isOpen && options.length > 0) {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }
      if (isOpen && options.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      if (isOpen && options.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
      }
      return;
    }

    if (e.key === "Enter") {
      if (isOpen) {
        e.preventDefault();
        e.stopPropagation();
        if (!loading && options.length > 0 && highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelectOption(options[highlightedIndex]);
        }
      }
    }
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const renderOptionContent = (option: Option) => {
    return displayFields.map((field, index) => {
      const value = getNestedValue(option, field);

      if (!value) return null;

      return (
        <span key={field} className="block">
          {index === 0 ? (
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {value}
            </span>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {value}
            </span>
          )}
        </span>
      );
    });
  };

  // Log imediato quando selectedOption mudar
  useEffect(() => {
    if (selectedOption) {
      console.log("Estado atualizado: item da API selecionado");
    }
  }, [selectedOption]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <div className="relative">
            <Input
              ref={internalRef}
              startIcon={StartIcon}
              label={label}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (
                  inputValue.trim().length >= minChars &&
                  options.length > 0
                ) {
                  setIsOpen(true);
                }
              }}
              placeholder={placeholder}
              autoComplete="off"
              role="combobox"
              aria-expanded={isOpen}
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-activedescendant={
                isOpen && highlightedIndex >= 0
                  ? `${listboxId}-option-${highlightedIndex}`
                  : undefined
              }
              className={
                selectedOption ? "border-primary dark:border-primary" : ""
              }
            />
            {inputValue && !selectedOption && (
              <span className="absolute right-3 top-1/2 text-xs text-amber-500 dark:text-amber-400">
                Não registado
              </span>
            )}
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div
          ref={optionsContainerRef}
          role="listbox"
          id={listboxId}
          className="max-h-60 overflow-auto"
        >
          {loading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Buscando...
            </div>
          ) : error ? (
            <div className="px-4 py-3 text-sm text-destructive text-center">
              ❌ Erro ao buscar dados
            </div>
          ) : options.length > 0 ? (
            options.map((option: Option, index: number) => (
              <div
                key={option.id}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index || selectedOption?.id === option.id}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-3 cursor-pointer transition border-b border-border last:border-b-0 ${
                  highlightedIndex === index
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-accent/60"
                }`}
              >
                {renderOptionContent(option)}
              </div>
            ))
          ) : inputValue.trim().length >= minChars ? (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              <div className="mb-1">Nenhum resultado encontrado</div>
              <div className="text-xs text-amber-500 dark:text-amber-400">
                O texto digitado será usado como valor
              </div>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
});

/*

import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { icons } from "lucide-react";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

interface InputFetchProps {
  startIcon?: keyof typeof icons;
  label: string;
  endpoint: string;
  displayFields?: string[];
  onValueChange?: (value: string | number, fullObject?: Option | null) => void;
  placeholder?: string;
  debounceMs?: number;
  minChars?: number;
}

interface Option {
  id: number | string;
  [key: string]: any;
}

export function InputFetch({
  startIcon: StartIcon,
  label,
  endpoint,
  displayFields = ["name"],
  onValueChange,
  placeholder = "Digite para buscar...",
  debounceMs = 300,
  minChars = 2,
}: InputFetchProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [debouncedValue] = useDebounce(inputValue, debounceMs);
  const inputRef = useRef<HTMLInputElement>(null);

  const getNestedValue = useCallback((obj: any, path: string) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }, []);

  const { data: options = [], isLoading, error } = useQuery({
    queryKey: ["input-fetch", endpoint, debouncedValue],
    queryFn: async () => {
      const res = await api.get(
        `${endpoint}?search=${encodeURIComponent(debouncedValue)}`
      );
      return Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
    },
    enabled: debouncedValue.length >= minChars,
    staleTime: 1000 * 60 * 5,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedOption(null);
    setIsOpen(true);
  };

  const handleSelect = (option: Option) => {
    const text = displayFields
      .map((field) => getNestedValue(option, field))
      .filter(Boolean)
      .join(" - ");

    setInputValue(text);
    setSelectedOption(option);
    setIsOpen(false);
    onValueChange?.(option.id, option);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Input
            ref={inputRef}
            startIcon={StartIcon}
            label={label}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => inputValue.length >= minChars && setIsOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="max-h-60 overflow-auto">
          {isLoading && (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Buscando...
            </div>
          )}

          {error && (
            <div className="px-4 py-3 text-sm text-destructive text-center">
              Erro ao buscar
            </div>
          )}

          {!isLoading && options.length === 0 && inputValue.length >= minChars && (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Nenhum resultado encontrado
            </div>
          )}

          {options.map((option: any) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option)}
              className="px-4 py-3 cursor-pointer hover:bg-accent"
            >
              {displayFields.map((field) => (
                <div key={field}>
                  {getNestedValue(option, field)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

*/
