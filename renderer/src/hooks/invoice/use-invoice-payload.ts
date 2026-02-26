export function useInvoicePayload() {
  return function buildPayload(data: any, totals: any) {
    return {
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      proformaExpiresAt: data.proformaExpiresAt,

      client: data.clientId
        ? { id: data.clientId }
        : {
            name: data.client.name,
            phone: data.client.phone || undefined,
            address: data.client.address || undefined,
            taxNumber: data.client.taxNumber || undefined,
          },

      items: data.items.map((item: any) =>
        item.isFromAPI && item.id
          ? { id: item.id, quantity: item.quantity }
          : {
              name: item.description,
              price: item.unitPrice,
              quantity: item.quantity,
              type: item.type,
            }
      ),

      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      retentionAmount: totals.retentionAmount,
      total: totals.total,
    };
  };
}
