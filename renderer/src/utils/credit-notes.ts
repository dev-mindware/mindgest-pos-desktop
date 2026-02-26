import { InvoiceDetails, ReceiptDetails } from "@/types/credit-note";
import { CreditNoteFormData } from "@/schemas";
import { isInvoice } from "@/types/credit-notes-guards";

export function mapDocumentToCreditNoteDefaults(
  doc: InvoiceDetails | ReceiptDetails
): CreditNoteFormData {
  if (isInvoice(doc)) {
    return {
      reason: "CORRECTION",
      notes: "",
      invoiceBody: {
        client: {
          id: doc.clientId,
          name: doc.clientName,
          email: doc.clientEmail,
        },
        items: doc.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: doc.dueDate,
        subtotal: doc.subtotal,
        taxAmount: doc.taxAmount,
        discountAmount: doc.discountAmount,
        total: doc.totalAmount,
      },
    };
  }

  return {
    reason: "ANNULATION",
    notes: "",
    invoiceBody: {
      client: {
        id: doc.clientId,
        name: doc.clientName,
        email: doc.clientEmail,
      },
      items: [],
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: doc.issueDate, // deve vir da fatura recibo
      subtotal: doc.subtotal,
      taxAmount: doc.taxAmount,
      discountAmount: doc.discountAmount,
      total: doc.totalAmount,
    },
  };
}
