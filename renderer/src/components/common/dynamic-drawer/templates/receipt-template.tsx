import { ReceiptResponse } from "@/types/receipt";
import { formatCurrency, formatDateTime } from "@/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { paymentMethodMap } from "@/constants";
import { DownloadDocumentButton } from "@/components/client";

interface ReceiptTemplateProps {
  data: ReceiptResponse;
}

export function ReceiptTemplate({ data }: ReceiptTemplateProps) {
  return (
    <div className="space-y-6 text-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide">Recibo</h2>
          <p className="text-muted-foreground">{data.number}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Data</p>
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
          <h3 className="font-semibold mb-1 text-muted-foreground">
            Método de Pagamento
          </h3>
          <Badge variant="outline">
            {paymentMethodMap[data.paymentMethodStr] || data.paymentMethodStr}
          </Badge>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Referência Fatura:</span>
          <span>{data.originalInvoiceId || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Valor Recebido:</span>
          <span className="font-bold text-lg">
            {formatCurrency(Number(data.total))}
          </span>
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
          documentType="receipt"
          filenameBase={data.number}
        />
      </div>
    </div>
  );
}
