"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal, currentInvoiceStore } from "@/stores";
import { ReceiptFormData, ReceiptSchema } from "@/schemas";
import {
  Button,
  Input,
  GlobalModal,
  ButtonSubmit,
  RHFSelect,
  Textarea,
} from "@/components";
import { ErrorMessage, SucessMessage } from "@/utils/messages";
import { useGenerateReceipt } from "@/hooks/invoice";
import { formatCurrency } from "@/utils";
import { useEffect } from "react";

export function GenerateReceiptModal() {
  const { closeModal, open } = useModal();
  const isOpen = open["generate-receipt"];
  const { currentInvoice } = currentInvoiceStore();
  const { mutateAsync: generateReceipt } = useGenerateReceipt();
  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(ReceiptSchema),
    mode: "onChange",
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      paymentMethod: "CASH",
    },
  });

  useEffect(() => {
    if (!currentInvoice) return;

    setValue("originalInvoiceId", currentInvoice.id, { shouldValidate: true });
    setValue("discountAmount", currentInvoice.discountAmount ?? "0");
    setValue("taxAmount", currentInvoice.taxAmount ?? "0");
    setValue("retentionAmount", currentInvoice.receivedValue ?? "0");
    setValue("total", currentInvoice.total ?? "0");
  }, [currentInvoice, setValue]);


  async function onSubmit(data: ReceiptFormData) {
    try {
      if (!currentInvoice) {
        ErrorMessage("Fatura não selecionada");
        return;
      }

      await generateReceipt({
        issueDate: data.issueDate,
        paymentMethod: data.paymentMethod,
        discountAmount: parseFloat(data.discountAmount),
        taxAmount: parseFloat(data.taxAmount),
        retentionAmount: parseFloat(data.retentionAmount),
        originalInvoiceId: currentInvoice.id,
        total: parseFloat(data.total),
        notes: data.notes,
      });

      handleCancel();
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(error?.response?.data?.message || "Erro ao gerar recibo");
      } else {
        ErrorMessage("Erro ao gerar recibo");
      }
    }
  }

  const handleCancel = () => {
    reset();
    closeModal("generate-receipt");
  };

  if (!isOpen) return null;

  return (
    <GlobalModal
      canClose
      id="generate-receipt"
      title="Gerar Recibo"
      className="!max-h-[85vh] !w-max"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            readOnly
            type="date"
            label="Data de Emissão"
            startIcon="Calendar"
            {...register("issueDate")}
            error={errors.issueDate?.message}
          />

          <Input
            readOnly
            label="Total"
            startIcon="DollarSign"
            {...register("total")}
            error={errors.total?.message}
            value={formatCurrency(parseFloat(currentInvoice?.total as string))}
          />
        </div>

        <RHFSelect
          name="paymentMethod"
          label="Método de Pagamento"
          options={[
            { label: "Dinheiro", value: "CASH" },
            { label: "Cartão", value: "CARD" },
            { label: "Transferência", value: "TRANSFER" },
          ]}
          control={control}
        />

        <Textarea
          label="Observações (Opcional)"
          placeholder="Ex: Pagamento recebido para pedido #12345"
          {...register("notes")}
          error={errors.notes?.message}
        />

        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <ButtonSubmit className="w-max" isLoading={isSubmitting}>
            Gerar Recibo
          </ButtonSubmit>
        </div>
      </form>
    </GlobalModal>
  );
}
