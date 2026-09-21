"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditNoteSchema, CreditNoteFormData } from "@/schemas";
import { useCreateCreditNote, useAnnulationNote } from "@/hooks";
import { InvoiceDetails, ReceiptDetails } from "@/types/credit-note";
import { isInvoice } from "@/types/credit-notes-guards";
import { mapDocumentToCreditNoteDefaults } from "@/utils/credit-notes";
import { calculateCreditNoteCorrection } from "@/utils";
import { ButtonSubmit } from "@/components";
import { ManagerAuthModal, MODAL_MANAGER_AUTH_ID } from "@/components/client/pos";
import { useModal } from "@/stores/modal/use-modal-store";
import { useAuth } from "@/hooks/auth";
import { ErrorMessage } from "@/utils/messages";
import { ReasonNotesSection } from "./sections/ReasonNotesSection";
import { ClientDocumentSection } from "./sections/ClientDocumentSection";
import { ItemsSummarySection } from "./sections/ItemsSummarySection";

const getFriendlyErrorMessages = (errors: any): string[] => {
  const messages: string[] = [];
  
  const fieldLabels: Record<string, string> = {
    "reason": "Motivo",
    "notes": "Notas",
    "managerBarcode": "Código de Barras do Gerente",
    "invoiceBody.client.id": "Cliente",
    "invoiceBody.client.name": "Nome do Cliente",
    "invoiceBody.client.taxNumber": "NIF do Cliente",
    "invoiceBody.client.phone": "Telefone do Cliente",
    "invoiceBody.client.address": "Endereço do Cliente",
    "invoiceBody.issueDate": "Data de Emissão",
    "invoiceBody.dueDate": "Data de Vencimento",
    "invoiceBody.subtotal": "Subtotal da factura",
    "invoiceBody.taxAmount": "Valor do Imposto",
    "invoiceBody.discountAmount": "Valor do Desconto",
    "invoiceBody.total": "Total da factura",
    "creditNote.subtotal": "Subtotal da Nota de Crédito",
    "creditNote.taxAmount": "Imposto da Nota de Crédito",
    "creditNote.discountAmount": "Desconto da Nota de Crédito",
    "creditNote.total": "Total da Nota de Crédito",
  };

  const walk = (obj: any, path: string = "") => {
    if (!obj || typeof obj !== "object") return;
    
    if (typeof obj.message === "string") {
      let displayPath = path;
      if (path.startsWith("invoiceBody.items[")) {
        const match = path.match(/invoiceBody\.items\[(\d+)\]\.(.*)/);
        if (match) {
          const index = parseInt(match[1]) + 1;
          const field = match[2];
          const fieldNameMap: Record<string, string> = {
            name: "Nome",
            quantity: "Quantidade",
            price: "Preço Unitário",
          };
          displayPath = `Item ${index} (${fieldNameMap[field] || field})`;
        }
      } else {
        displayPath = fieldLabels[path] || path;
      }
      messages.push(`${displayPath}: ${obj.message}`);
      return;
    }

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const nextPath = path 
          ? isNaN(Number(key)) 
            ? `${path}.${key}` 
            : `${path}[${key}]`
          : key;
        
        walk(obj[key], nextPath);
      }
    }
  };

  walk(errors);
  return messages;
};

type Props = {
  invoice: InvoiceDetails | ReceiptDetails;
  docType?: "invoice-receipt" | "invoice-normal";
};

export function CreditNoteForm({ invoice, docType }: Props) {
  const router = useRouter();
  const { openModal } = useModal();
  const { user } = useAuth();
  const { mutateAsync: annulationNote } = useAnnulationNote();
  const { mutateAsync: createCreditNote } = useCreateCreditNote();

  const isInvoiceDoc = isInvoice(invoice);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreditNoteFormData>({
    resolver: zodResolver(CreditNoteSchema),
    mode: "onChange",
    defaultValues: mapDocumentToCreditNoteDefaults(invoice),
  });

  const reason = useWatch({ control, name: "reason" });
  const watchedItems = useWatch({ control, name: "invoiceBody.items" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoiceBody.items",
  });

  // Mantém no documento os dados do cliente associado à factura original.
  useEffect(() => {
    if (invoice.client) {
      setValue("invoiceBody.client.id", invoice.client.id);
      setValue("invoiceBody.client.name", invoice.client.name);
      setValue("invoiceBody.client.taxNumber", (invoice.client as any).taxNumber || "");
      setValue("invoiceBody.client.address", (invoice.client as any).address || "");
      setValue("invoiceBody.client.phone", (invoice.client as any).phone || "");
      setValue("invoiceBody.client.email", (invoice.client as any).email || "");
    }
    // Sem cliente registado, ficam os valores genéricos de consumidor final
    // definidos nos defaults (ver mapDocumentToCreditNoteDefaults).
  }, [invoice, setValue]);

  // Recalculo dos totais e delta (creditNote)
  useEffect(() => {
    if (reason === "ANNULMENT") return;

    const correction = calculateCreditNoteCorrection(
      {
        items: isInvoice(invoice)
          ? invoice.items.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              tax: (item as any).tax != null ? Number((item as any).tax) : undefined,
            }))
          : [],
        subtotal: invoice.subtotal,
        taxAmount: invoice.taxAmount,
        discountAmount: invoice.discountAmount,
      },
      (watchedItems || []).map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        tax: item.tax,
      })),
    );

    setValue("invoiceBody.subtotal", correction.invoiceBody.subtotal);
    setValue("invoiceBody.taxAmount", correction.invoiceBody.taxAmount);
    setValue("invoiceBody.discountAmount", correction.invoiceBody.discountAmount);
    setValue("invoiceBody.total", correction.invoiceBody.total);
    setValue("creditNote", correction.creditNote);
  }, [watchedItems, reason, invoice, setValue]);

  const originalItems = isInvoice(invoice)
    ? invoice.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: Number(item.quantity || 1),
        unitPrice: Number(item.unitPrice || (item as any).price || 0),
      }))
    : [];

  const originalTotal = Number(invoice.total ?? (invoice as any).totalAmount ?? 0);
  const watchedCreditNoteTotal = useWatch({ control, name: "creditNote.total" });
  const watchedInvoiceBodyTotal = useWatch({ control, name: "invoiceBody.total" });

  const hasLineExceeding = (watchedItems || []).some((item) => {
    const orig = originalItems.find((o) => o.id === item.id);
    return orig && (Number(item.quantity || 0) > orig.quantity || Number(item.price || 0) > orig.unitPrice + 0.01);
  });

  const isExceedingTotal = (Number(watchedInvoiceBodyTotal) || 0) > originalTotal + 0.01;
  const isCreditZeroOrNegative = (Number(watchedCreditNoteTotal) || 0) <= 0;
  const isSubmitDisabled = reason !== "ANNULMENT" && (hasLineExceeding || isExceedingTotal || isCreditZeroOrNegative);

  // Anulação ou Correção: a autorização do gerente é recolhida pelo ManagerAuthModal
  // (scanner) quando o utilizador tem role CASHIER.
  async function handleManagerAuthenticated(barcode: string) {
    const data = getValues();
    try {
      if (data.reason === "ANNULMENT") {
        await annulationNote({
          id: invoice.id,
          reason: "ANNULMENT",
          notes: data.notes ?? "",
          managerBarcode: barcode || undefined,
        });
      } else {
        const payload = {
          ...data,
          managerBarcode: barcode || undefined,
          invoiceBody: {
            ...data.invoiceBody,
            items: data.invoiceBody.items.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ tax, taxId, ...item }) => item,
            ),
          },
        };
        await createCreditNote({ id: invoice.id, data: payload });
      }
      router.replace("/pos/movements?tab=credit-notes");
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message || "Erro ao emitir nota de crédito",
      );
      // Relança para o modal limpar o buffer e permitir nova leitura.
      throw error;
    }
  }

  async function onSubmit(data: CreditNoteFormData) {
    if (data.reason !== "ANNULMENT") {
      // Correção/rectificação: a nota de crédito só pode reduzir valor (art. 3.º l)).
      const originalTotal = invoice.total ?? (invoice as any).totalAmount ?? 0;
      if (data.invoiceBody.total > originalTotal + 0.01) {
        ErrorMessage(
          "O total corrigido não pode ser superior ao total do documento original.",
        );
        return;
      }
      if (data.creditNote.total <= 0) {
        ErrorMessage("A nota de crédito não altera o valor do documento.");
        return;
      }
      const hasLineIncrease = data.creditNote.items.some(
        (item) =>
          item.newPrice > item.originalPrice + 0.01 ||
          item.quantity > item.originalQuantity,
      );
      if (hasLineIncrease) {
        ErrorMessage(
          "Uma nota de crédito só pode reduzir: não aumente a quantidade nem o preço dos itens.",
        );
        return;
      }
    }

    // Role CASHIER necessita de autorização de gerente (OWNER/MANAGER/ADMIN podem autorizar directamente)
    if (user?.role === "CASHIER") {
      openModal(MODAL_MANAGER_AUTH_ID);
    } else {
      await handleManagerAuthenticated("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        const errorList = getFriendlyErrorMessages(errors);
        if (errorList.length > 0) {
          ErrorMessage(`Erro de validação: ${errorList.join(" | ")}`);
        } else {
          ErrorMessage("Por favor, preencha todos os campos obrigatórios corretamente.");
        }
      })}
      className="space-y-6"
    >
      <section className="rounded-lg border bg-card p-5 shadow-sm" data-tour="credit-note-reason">
        <ReasonNotesSection
          control={control}
          register={register}
          errors={errors}
          isInvoiceDoc={isInvoiceDoc}
        />
      </section>

      {reason !== "ANNULMENT" && (
        <div className="space-y-6">
          <div data-tour="credit-note-client">
            <ClientDocumentSection
              register={register}
              errors={errors}
              isInvoiceDoc={isInvoiceDoc}
              docType={docType}
              client={invoice.client}
            />
          </div>

          <div data-tour="credit-note-items">
            <ItemsSummarySection
              control={control}
              register={register}
              errors={errors}
              fields={fields}
              originalItems={originalItems}
              originalTotal={originalTotal}
              append={append}
              remove={remove}
            />
          </div>
        </div>
      )}

      <div className="sticky bottom-0 flex justify-end border-t bg-background/95 py-4 backdrop-blur" data-tour="credit-note-submit">
        <ButtonSubmit className="w-max" isLoading={isSubmitting} disabled={isSubmitDisabled}>
          {reason === "ANNULMENT"
            ? "Confirmar Anulação"
            : "Emitir Nota de Crédito"}
        </ButtonSubmit>
      </div>

      <ManagerAuthModal bypass={user?.role !== "CASHIER"} onAuthenticated={handleManagerAuthenticated} />
    </form>
  );
}
