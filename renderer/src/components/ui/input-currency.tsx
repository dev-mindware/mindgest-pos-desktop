"use client";

import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { icons } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon, AlertError } from "../common";

interface InputCurrencyProps
  extends Omit<NumericFormatProps, "onValueChange"> {
  label?: string;
  error?: string;
  startIcon?: keyof typeof icons;
  endIcon?: keyof typeof icons;
  containerClassName?: string;
  onValueChange?: (value: number) => void;
}

const InputCurrency = React.forwardRef<HTMLInputElement, InputCurrencyProps>(
  (
    {
      label,
      error,
      startIcon,
      endIcon,
      containerClassName,
      className,
      id,
      name,
      onValueChange,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={id || name}
            className="block mb-1 text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "flex items-center rounded-md border px-3 py-2 text-sm transition-colors duration-200 w-full",
            error
              ? "border-red-500 ring-1 ring-red-400"
              : "border-input focus-within:border-primary-500 focus-within:ring-[3px] focus-within:ring-ring/50"
          )}
        >
          {startIcon && (
            <Icon
              name={startIcon}
              size={18}
              className="mr-2 text-muted-foreground"
            />
          )}

          <NumericFormat
            getInputRef={ref}
            id={id}
            name={name}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            className={cn(
              "flex-1 bg-transparent placeholder:text-muted-foreground text-foreground outline-none text-left",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            onValueChange={(values) => {
              onValueChange?.(values.floatValue ?? 0);
            }}
            {...props}
          />

          {endIcon && (
            <Icon
              name={endIcon}
              size={18}
              className="ml-2 text-muted-foreground"
            />
          )}
        </div>

        {error && <AlertError errorMessage={error} />}
      </div>
    );
  }
);

InputCurrency.displayName = "InputCurrency";

export { InputCurrency };
