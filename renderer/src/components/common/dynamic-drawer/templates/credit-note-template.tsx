import { CreditNotesResponse } from "@/types/credit-note";
import { formatCurrency, formatDateTime } from "@/utils";
import { Separator } from "@/components/ui/separator";
import { DocumentStatusBadge, DownloadDocumentButton } from "@/components/client/documents/common";

interface Props {
  data: CreditNotesResponse;
}

export function CreditNoteTemplate({ data }: Props) {
  const { invoice } = data;

  return (
    <div className="space-y-6 text-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide">
            Nota de Crédito
          </h2>
          <p className="text-muted-foreground">{data.number}</p>
          <p className="text-muted-foreground mt-1">
            Ref. Fatura: {invoice.number}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">Data de Emissão</p>
          <p>{formatDateTime(data.createdAt)}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-1 text-muted-foreground">Cliente</h3>
          <p className="font-medium text-lg">{data.client.name}</p>
        </div>

        <div className="text-right">
          <h3 className="font-semibold mb-1 text-muted-foreground">Estado</h3>
          <DocumentStatusBadge status={data.status} />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-1 text-muted-foreground">
          Motivo da Nota de Crédito
        </h3>
        <p>{data.reason === "CORRECTION" ? "Correção" : "Cancelamento"}</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Item</th>
              <th className="px-4 py-2 text-right font-medium">Qtd</th>
              <th className="px-4 py-2 text-right font-medium">Preço</th>
              <th className="px-4 py-2 text-right font-medium">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2">{item.itemsId}</td>
                <td className="px-4 py-2 text-right">{item.quantity}</td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(Number(item.price))}
                </td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(Number(item.total))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="w-full sm:w-1/2 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>{formatCurrency(Number(invoice.subtotal))}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Desconto:</span>
            <span>{formatCurrency(Number(invoice.discountAmount ?? 0))}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Imposto:</span>
            <span>{formatCurrency(Number(invoice.taxAmount))}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total da Fatura:</span>
            <span>{formatCurrency(Number(invoice.total))}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="mt-6">
          <h3 className="font-semibold mb-1 text-muted-foreground">Notas</h3>
          <p className="text-muted-foreground">{data.notes}</p>
        </div>
      )}
      <div className="flex justify-end">
        <DownloadDocumentButton
          id={data.id}
          documentType="credit-note"
          filenameBase={data.number}
        />
      </div>
    </div>
  );
}
