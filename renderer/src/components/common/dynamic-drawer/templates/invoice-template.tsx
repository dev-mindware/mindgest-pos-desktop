import { InvoiceResponse, DocumentType } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import { Separator } from "@/components/ui/separator";
import {
  DocumentStatusBadge,
  DownloadDocumentButton,
} from "@/components/client";

interface InvoiceTemplateProps {
  type: DocumentType
  data: InvoiceResponse;
  hideDueDate?: boolean;
  hideActions?: boolean;
  changeValue?: number;
}

export function InvoiceTemplate({ type, data, hideDueDate, hideActions, changeValue }: InvoiceTemplateProps) {
  return (
    <div className="space-y-6 text-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide">Fatura</h2>
          <p className="text-muted-foreground">{data.number}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Data de Emissão</p>
          <p>{formatDateTime(data.createdAt)}</p>
          {!hideDueDate && (
            <>
              <p className="font-semibold mt-2">Vencimento</p>
              <p>{formatDateTime(data.dueDate)}</p>
            </>
          )}
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
                <td className="px-4 py-2">{item.item.name}</td>
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
            <span>{formatCurrency(Number(data.subtotal))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Desconto:</span>
            <span>
              {data.discountAmount
                ? formatCurrency(Number(data.discountAmount))
                : formatCurrency(0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Imposto:</span>
            <span>{formatCurrency(Number(data.taxAmount))}</span>
          </div>

          {changeValue !== undefined && changeValue > 0 && (
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Troco:</span>
              <span>{formatCurrency(changeValue)}</span>
            </div>
          )}

          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(Number(data.total))}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="mt-6">
          <h3 className="font-semibold mb-1 text-muted-foreground">Notas</h3>
          <p className="text-muted-foreground">{data.notes}</p>
        </div>
      )}
      {!hideActions && (
        <div className="flex justify-end">
          <DownloadDocumentButton
            id={data.id}
            documentType={type}
            filenameBase={data.number}
          />
        </div>
      )}
    </div>
  );
}
