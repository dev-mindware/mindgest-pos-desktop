"use client";

import {
  Controller,
  useWatch,
  type Control,
  type UseFieldArrayAppend,
  type UseFormRegister,
} from "react-hook-form";
import { Trash2 } from "lucide-react";
import type { CreditNoteFormData } from "@/schemas";
import { Button, Icon, Input, InputCurrency, Separator } from "@/components";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency } from "@/utils";

interface OriginalItemInfo {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface ItemsSummarySectionProps {
  control: Control<CreditNoteFormData>;
  register: UseFormRegister<CreditNoteFormData>;
  errors: any;
  fields: any[];
  originalItems?: OriginalItemInfo[];
  originalTotal?: number;
  append?: UseFieldArrayAppend<CreditNoteFormData, "invoiceBody.items">;
  remove: (index: number) => void;
}

export function ItemsSummarySection({
  control,
  register,
  errors,
  fields,
  originalItems,
  originalTotal,
  remove,
}: ItemsSummarySectionProps) {
  const watchedItems = useWatch({ control, name: "invoiceBody.items" });
  const creditNoteSubtotal = useWatch({ control, name: "creditNote.subtotal" });
  const creditNoteTaxAmount = useWatch({ control, name: "creditNote.taxAmount" });
  const creditNoteTotal = useWatch({ control, name: "creditNote.total" });
  const invoiceBodySubtotal = useWatch({ control, name: "invoiceBody.subtotal" });
  const invoiceBodyTotal = useWatch({ control, name: "invoiceBody.total" });

  const hasAnyExceededLine = watchedItems?.some((item) => {
    const orig = originalItems?.find((o) => o.id === item.id);
    return orig && (Number(item.quantity || 0) > orig.quantity || Number(item.price || 0) > orig.unitPrice + 0.01);
  });

  const isExceedingTotal = originalTotal != null && (Number(invoiceBodyTotal) || 0) > originalTotal + 0.01;
  const isCreditZero = (Number(creditNoteTotal) || 0) <= 0;

  return (
    <section className="space-y-6 rounded-lg border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold">Itens retificados</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reduza a quantidade ou o preço dos itens, ou remova-os. Uma nota de
          crédito só pode reduzir o valor do documento original (art. 3.º l) do D.P. 71/25).
        </p>
      </div>

      {/* Alertas visuais de conformidade legal */}
      {(hasAnyExceededLine || isExceedingTotal) && (
        <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
          <Icon name="AlertTriangle" className="h-5 w-5 text-destructive" />
          <AlertTitle className="font-semibold text-destructive">
            Infração Fiscal Detetada (D.P. 71/25)
          </AlertTitle>
          <AlertDescription className="text-xs">
            Uma nota de crédito só pode retificar reduzindo o valor faturado. O preço ou quantidade digitado supera o original do documento, o que viola o regime jurídico das faturas da AGT. A emissão está bloqueada até os valores serem corrigidos.
          </AlertDescription>
        </Alert>
      )}

      {isCreditZero && !hasAnyExceededLine && !isExceedingTotal && (
        <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <Icon name="Info" className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-xs">
            Para emitir uma nota de crédito retificativa, reduza a quantidade ou o preço de pelo menos um item, ou remova um item para gerar valor a creditar.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const orig = originalItems?.find((o) => o.id === field.id);
          const maxQty = orig ? orig.quantity : 999999;
          const maxPrice = orig ? orig.unitPrice : 999999999;
          const currentQty = Number(watchedItems?.[index]?.quantity || 0);
          const currentPrice = Number(watchedItems?.[index]?.price || 0);
          const isQtyExceeded = orig ? currentQty > maxQty : false;
          const isPriceExceeded = orig ? currentPrice > maxPrice + 0.01 : false;

          return (
            <div
              key={field.id}
              className={`grid gap-4 rounded-lg border p-4 md:grid-cols-[minmax(180px,1fr)_160px_200px_140px_40px] md:items-end transition-colors ${
                isQtyExceeded || isPriceExceeded ? "border-destructive/60 bg-destructive/5" : ""
              }`}
            >
              <div>
                <Input
                  {...register(`invoiceBody.items.${index}.name`)}
                  label="Item"
                  disabled
                  className="bg-muted/50 cursor-not-allowed"
                  error={errors?.invoiceBody?.items?.[index]?.name?.message}
                />
              </div>

              <Controller
                control={control}
                name={`invoiceBody.items.${index}.quantity`}
                render={({ field: quantityField, fieldState }) => (
                  <div>
                    <Input
                      type="quantity"
                  label="Quantidade"
                      min={1}
                      max={maxQty}
                      value={Number(quantityField.value || 1)}
                      onChange={(event) =>
                        quantityField.onChange(Math.max(1, Number(event.target.value)))
                      }
                      error={
                        isQtyExceeded
                          ? `Não pode exceder ${maxQty}`
                          : fieldState.error?.message
                      }
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`invoiceBody.items.${index}.price`}
                render={({ field: priceField, fieldState }) => (
                  <div>
                    <InputCurrency
                      ref={priceField.ref}
                  label="Preço unitário"
                      value={priceField.value}
                      onValueChange={priceField.onChange}
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      error={
                        isPriceExceeded
                          ? `Não pode exceder ${formatCurrency(maxPrice)}`
                          : fieldState.error?.message
                      }
                    />
                  </div>
                )}
              />

              <div className="space-y-1">
                <span className="text-sm font-medium">Total</span>
                <div className="flex h-10 items-center justify-end rounded-md bg-muted px-3 font-mono text-sm font-semibold">
                  {formatCurrency(
                    Number(watchedItems?.[index]?.quantity || 0) *
                      Number(watchedItems?.[index]?.price || 0),
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => remove(index)}
                aria-label={`Remover ${watchedItems?.[index]?.name || "item"}`}
                title="Remover item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}

        {fields.length === 0 && (
          <div className="rounded-lg border border-dashed bg-muted/10 p-8 text-center text-sm text-muted-foreground">
            O documento corrigido deve conter, pelo menos, um item.
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2" data-tour="credit-note-totals">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h3 className="text-sm font-semibold">Valor da nota de crédito</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal a creditar</span>
              <span className={isCreditZero ? "text-destructive font-semibold" : ""}>
                {formatCurrency(creditNoteSubtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Imposto</span>
              <span>{formatCurrency(creditNoteTaxAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total a creditar</span>
              <span className={isCreditZero ? "text-destructive font-bold" : "text-primary"}>
                {formatCurrency(creditNoteTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/20 p-4">
          <h3 className="text-sm font-semibold">Documento após a retificação</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(invoiceBodySubtotal)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total final</span>
              <span className={isExceedingTotal ? "text-destructive font-bold" : ""}>
                {formatCurrency(invoiceBodyTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

