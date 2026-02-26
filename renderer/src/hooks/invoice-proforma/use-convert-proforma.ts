import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  invoiceService,
  invoiceReceiptService,
  proformaService,
} from "@/services";
import { InvoiceResponse } from "@/types";
import { SucessMessage, ErrorMessage } from "@/utils/messages";

type ConversionType = "invoice" | "invoice-receipt";

/** Maps proforma InvoiceItem[] to the payload items format expected by both endpoints. */
function mapItems(items: InvoiceResponse["items"]) {
  return items.map((item) => ({
    id: item.itemsId,
    quantity: item.quantity,
  }));
}

async function createDocument(type: ConversionType, proforma: InvoiceResponse) {
  const issueDate = new Date().toISOString();
  const client = proforma.client?.id
    ? { id: proforma.client.id }
    : {
        name: proforma.client?.name ?? "",
        phone: proforma.client?.phone ?? undefined,
        address: proforma.client?.address ?? undefined,
      };

  const basePayload = {
    issueDate,
    client,
    items: mapItems(proforma.items),
    total: Number(proforma.total),
    taxAmount: Number(proforma.taxAmount),
    discountAmount: Number(proforma.discountAmount),
  };

  if (type === "invoice") {
    return invoiceService.createInvoice({
      ...basePayload,
      dueDate: issueDate,
    });
  }

  return invoiceReceiptService.createInvoiceReceipt(basePayload);
}

export function useConvertProforma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      proforma,
      type,
    }: {
      proforma: InvoiceResponse;
      type: ConversionType;
    }) => {
      const res = await createDocument(type, proforma);
      const id = res.data?.id ?? res.data?.data?.id;
      await proformaService.deleteProforma(proforma.id);
      return { id, type };
    },
    onSuccess: (result, { type }) => {
      const label = type === "invoice" ? "Fatura" : "Fatura Recibo";
      SucessMessage(`Proforma convertida em ${label} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["invoice-proforma"] });
      queryClient.invalidateQueries({
        queryKey: [type === "invoice" ? "invoice" : "invoice-receipt"],
      });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "Erro ao converter proforma";
      ErrorMessage(msg);
    },
  });
}
