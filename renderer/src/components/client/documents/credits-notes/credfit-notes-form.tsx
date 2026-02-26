"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditNoteSchema, CreditNoteFormData } from "@/schemas";
import { useCreateCreditNote, useAnnulationNote } from "@/hooks";
import { InvoiceDetails, ReceiptDetails } from "@/types/credit-note";
import { isInvoice, isReceipt } from "@/types/credit-notes-guards";
import { mapDocumentToCreditNoteDefaults } from "@/utils/credit-notes";
import { formatCurrency, parseCurrency } from "@/utils";
import { ButtonSubmit, Input, RHFSelect, Textarea } from "@/components";
import { ErrorMessage } from "@/utils/messages";

type Props = {
  invoice: InvoiceDetails | ReceiptDetails;
};

export function CreditNoteForm({ invoice }: Props) {
  const router = useRouter();
  const { mutateAsync: annulationNote } = useAnnulationNote();
  const { mutateAsync: createCreditNote } = useCreateCreditNote();

  const isInvoiceDoc = isInvoice(invoice);
  const isReceiptDoc = isReceipt(invoice);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreditNoteFormData>({
    resolver: zodResolver(CreditNoteSchema),
    mode: "onChange",
    defaultValues: mapDocumentToCreditNoteDefaults(invoice),
  });

  const reason = useWatch({ control, name: "reason" });
  const watchedItems = useWatch({ control, name: "invoiceBody.items" });

  // Recalculo apenas para INVOICE
  useEffect(() => {
    if (!isInvoiceDoc) return;
    if (reason === "ANNULATION") return;

    const subtotal =
      watchedItems?.reduce(
        (acc, item) =>
          acc + (Number(item.quantity) || 0) * (Number(item.price) || 0),
        0
      ) ?? 0;

    const base = invoice.subtotal || 1;
    const taxRate = invoice.taxAmount / base;
    const discountRate = invoice.discountAmount / base;

    const tax = subtotal * taxRate;
    const discount = subtotal * discountRate;
    const total = subtotal + tax - discount;

    setValue("invoiceBody.subtotal", +subtotal.toFixed(2));
    setValue("invoiceBody.taxAmount", +tax.toFixed(2));
    setValue("invoiceBody.discountAmount", +discount.toFixed(2));
    setValue("invoiceBody.total", +total.toFixed(2));
  }, [watchedItems, reason]);

  const { fields } = useFieldArray({
    control,
    name: "invoiceBody.items",
  });

  async function onSubmit(data: CreditNoteFormData) {
    try {
      if (data.reason === "ANNULATION") {
        await annulationNote({
          id: invoice.id,
          reason: data.reason,
          notes: data.notes ?? "",
        });
      } else {
        await createCreditNote({
          id: invoice.id,
          data,
        });
      }

      router.replace("/documents?tab=credit-notes");
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message || "Erro ao emitir nota de crédito"
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 space-y-8 border rounded-lg"
    >
      <RHFSelect
        label="Motivo"
        name="reason"
        control={control}
        options={[
          ...(isInvoiceDoc
            ? [{ value: "CORRECTION", label: "Correção" }]
            : []),
          { value: "ANNULATION", label: "Anulação Total" },
        ]}
      />

      <Textarea
        label="Notas"
        {...register("notes")}
        error={errors?.notes?.message}
      />

      {isInvoiceDoc && reason === "CORRECTION" && (
        <div className="space-y-6">
          {fields.map((field, index) => {
            const originalItem = invoice.items[index];
            return (
              <div key={field.id} className="grid md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  label="Quantidade"
                  {...register(`invoiceBody.items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />

                <Controller
                  control={control}
                  name={`invoiceBody.items.${index}.price`}
                  render={({ field }) => (
                    <Input
                      label="Preço Unit."
                      value={formatCurrency(field.value ?? 0)}
                      onChange={(e) =>
                        field.onChange(parseCurrency(e.target.value))
                      }
                    />
                  )}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end">
        <ButtonSubmit className="w-max" isLoading={isSubmitting}>
          {reason === "ANNULATION"
            ? "Confirmar Anulação"
            : "Emitir Nota de Crédito"}
        </ButtonSubmit>
      </div>
    </form>
  );
}
