"use client";

import type { UseFormRegister } from "react-hook-form";
import type { CreditNoteFormData } from "@/schemas";
import type { Client } from "@/types/clients";
import { Icon, Input } from "@/components";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CONSUMIDOR_FINAL_CLIENT } from "@/utils/credit-notes";

interface ClientDocumentSectionProps {
  register: UseFormRegister<CreditNoteFormData>;
  errors: any;
  isInvoiceDoc: boolean;
  docType?: "invoice-receipt" | "invoice-normal";
  client?: Client;
}

export function ClientDocumentSection({
  register,
  errors,
  isInvoiceDoc,
  docType,
  client,
}: ClientDocumentSectionProps) {
  // Sem cliente registado (factura ao consumidor final), mostra os dados genéricos.
  const c: any = client ?? CONSUMIDOR_FINAL_CLIENT;
  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold">Cliente do documento de origem</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A nota de crédito está estritamente vinculada ao cliente da fatura original e não permite alteração de titular.
        </p>
      </div>

      <Alert className="mb-5 border-blue-500/20 bg-blue-500/5 text-blue-900 dark:text-blue-200">
        <Icon name="ShieldCheck" className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="font-semibold">Imutabilidade Fiscal do Cliente</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Por conformidade com a regulamentação fiscal da AGT (art. 8.º do D.P. 71/25), uma nota de crédito é um documento retificativo que herda e preserva integralmente a identidade fiscal do destinatário do documento original.
        </AlertDescription>
      </Alert>

      <input type="hidden" {...register("invoiceBody.client.id")} />
      <input type="hidden" {...register("invoiceBody.client.name")} />
      <input type="hidden" {...register("invoiceBody.client.taxNumber")} />
      <input type="hidden" {...register("invoiceBody.client.phone")} />
      <input type="hidden" {...register("invoiceBody.client.email")} />
      <input type="hidden" {...register("invoiceBody.client.address")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Nome"
          value={c.name || "Consumidor Final"}
          disabled
          className="bg-muted/60 cursor-not-allowed select-none opacity-80"
        />
        <Input
          label="NIF"
          value={c.taxNumber || "Não informado"}
          disabled
          className="bg-muted/60 cursor-not-allowed select-none opacity-80"
        />
        <Input
          label="Email"
          value={c.email || "Não informado"}
          disabled
          className="bg-muted/60 cursor-not-allowed select-none opacity-80"
        />
        <Input
          label="Telefone"
          value={c.phone || "Não informado"}
          disabled
          className="bg-muted/60 cursor-not-allowed select-none opacity-80"
        />
        <Input
          label="Endereço"
          value={c.address || "Não informado"}
          disabled
          className="bg-muted/60 cursor-not-allowed select-none opacity-80"
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input
          type="date"
          label="Data de emissão"
          {...register("invoiceBody.issueDate")}
          error={errors.invoiceBody?.issueDate?.message}
        />
        {isInvoiceDoc && docType !== "invoice-receipt" && (
          <Input
            type="date"
            label="Data de vencimento"
            {...register("invoiceBody.dueDate")}
            error={errors.invoiceBody?.dueDate?.message}
          />
        )}
      </div>
    </section>
  );
}

