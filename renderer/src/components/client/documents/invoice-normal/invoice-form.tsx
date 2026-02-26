"use client";
import { ErrorMessage } from "@/utils/messages";
import { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@/components";
import { InvoiceFormData, InvoiceSchema } from "@/schemas";
import {
  useClientSelection,
  useCreateInvoice,
  useInvoiceTotals,
} from "@/hooks";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { currentStoreStore, useAuthStore, useModal } from "@/stores";
import { InvoiceItems } from "../document-forms/items";

export function InvoiceForm() {
  const { user } = useAuthStore();
  const { mutateAsync: createInvoiceNormal, isPending } = useCreateInvoice();
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(InvoiceSchema),
    mode: "onSubmit",
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      items: [],
      globalRetention: 0,
      globalDiscount: 0,
      client: {
        name: "",
        phone: "",
        address: "",
        taxNumber: "",
      },
      clientId: "",
      notes: "",
      storeId: "",
    },
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = form;

  const { handleClientChange, selectedClient, setSelectedClient } =
    useClientSelection(setValue);
  const { openModal } = useModal();
  const { currentStore } = currentStoreStore();

  const fieldArray = useFieldArray<InvoiceFormData, "items">({
    control,
    name: "items",
  });

  const watchedValues = watch([
    "items",
    "globalRetention",
    "globalDiscount",
    "client.name",
    "clientId",
  ]);

  const [
    items,
    globalRetention,
    globalDiscount,
    clientName,
    clientId,
  ] = watchedValues;

  const totals = useInvoiceTotals({
    items: items ?? [],
    retention: globalRetention ?? 0,
    discount: globalDiscount ?? 0,
  });

  const setGlobalRetention = useCallback(
    (v: number) => setValue("globalRetention", v, { shouldValidate: true }),
    [setValue]
  );

  const setGlobalDiscount = useCallback(
    (v: number) => setValue("globalDiscount", v, { shouldValidate: true }),
    [setValue]
  );

  const clientState = useMemo(() => {
    const hasClient = Boolean(clientName);
    const isNewClient = hasClient && !clientId;
    return { hasClient, isNewClient };
  }, [clientName, clientId]);

  // Stable reference — prevents AsyncCreatableSelectField from re-fetching
  // every time the parent form re-renders (e.g. on typing in another input).
  const clientDisplayFields = useMemo(() => ["name", "email"], []);

  const onSubmit = useCallback(
    async (data: InvoiceFormData) => {
      try {
        if (!data.items || data.items.length === 0) {
          ErrorMessage("Adicione pelo menos um item à fatura");
          return;
        }

        const clientPayload = data.clientId
          ? { id: data.clientId }
          : {
            name: data.client.name,
            phone: data.client.phone || undefined,
            address: data.client.address || undefined,
            taxNumber: data.client.taxNumber || undefined,
          };

        const itemsPayload = data.items.map((item) => {
          if (item.isFromAPI && item.apiId) {
            return { id: item.apiId, quantity: item.quantity };
          }

          return {
            name: item.description,
            price: item.unitPrice,
            quantity: item.quantity,
            type: item.type,
            taxId: item.taxId,
          };
        });


        const finalPayload = {
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          client: clientPayload,
          items: itemsPayload,
          total: totals.total,
          taxAmount: totals.taxAmount,
          retentionAmount: totals.retentionAmount,
          discountAmount: totals.discountAmount,
          subtotal: totals.subtotal,
          notes: data.notes || undefined,
          ...(user?.role === "OWNER" &&
            currentStore?.id && { storeId: currentStore?.id }),
        };

        const response = await createInvoiceNormal(finalPayload);
        const invoiceId = response?.data?.id;

        if (invoiceId) {
          openModal("document-success", { id: invoiceId, type: "invoice" });
        }

        reset();
        setSelectedClient(null);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Ocorreu um erro ao criar a fatura. Tente novamente.";

        ErrorMessage(errorMessage);
      }
    },
    [createInvoiceNormal, reset, setSelectedClient, totals, user?.role]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => console.log("Erro de Validação na Fatura:", errors))}
      className="p-8 mt-4 space-y-8 border rounded-lg"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Input
          type="date"
          label="Data de Emissão"
          {...register("issueDate")}
          error={errors.issueDate?.message}
          disabled
        />
        <Input
          type="date"
          label="Data de Vencimento"
          {...register("dueDate")}
          error={errors.dueDate?.message}
          required
        />

        <AsyncCreatableSelectField
          minChars={2}
          endpoint="/clients"
          label="Cliente"
          placeholder="Digite o nome do cliente..."
          value={selectedClient}
          onChange={handleClientChange}
          displayFields={clientDisplayFields}
          formatCreateLabel={(inputValue: string) => `➕ Criar "${inputValue}"`}
          error={errors.client?.name?.message}
        />
        <input type="hidden" {...register("clientId")} />
        <input type="hidden" {...register("client.name")} />
      </div>

      {clientState.hasClient && (
        <div className="grid gap-6 md:grid-cols-3 animate-in fade-in duration-300">
          <Input
            label="NIF"
            {...register("client.taxNumber")}
            error={errors.client?.taxNumber?.message}
            disabled={!clientState.isNewClient}
            placeholder="000000000"
          />
          <Input
            label="Telefone"
            {...register("client.phone")}
            error={errors.client?.phone?.message}
            disabled={!clientState.isNewClient}
            placeholder="9xxxxxxxx"
          />
          <Input
            label="Endereço"
            {...register("client.address")}
            error={errors.client?.address?.message}
            disabled={!clientState.isNewClient}
            placeholder="Luanda, Angola"
          />
        </div>
      )}

      <InvoiceItems
        totals={totals}
        fieldArray={fieldArray as any}
        globalRetention={globalRetention ?? 0}
        setGlobalRetention={setGlobalRetention}
        globalDiscount={globalDiscount ?? 0}
        setGlobalDiscount={setGlobalDiscount}
      />


      <Textarea
        {...register("notes")}
        placeholder="Adicione observações sobre esta fatura (opcional)"
        label="Observações"
        error={errors.notes?.message}
        rows={4}
      />

      <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setSelectedClient(null);
          }}
          disabled={isSubmitting || isPending}
        >
          Limpar Formulário
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isPending}
          className="min-w-[150px]"
        >
          {isPending || isSubmitting ? "Processando..." : "Criar Fatura"}
        </Button>
      </div>
    </form>
  );
}
