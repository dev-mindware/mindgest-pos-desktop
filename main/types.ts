export type PaymentMethod = "CASH" | "CARD" | "TRANSFER";

export type InvoiceClient = {
    id?: string;
    name?: string;
    phone?: string;
    address?: string;
    email?: string;
    taxNumber?: string;
    offlineId?: string
}

export type InvoiceItem = {
    id: string;
    quantity: number;
};

export type InvoiceReceiptCloudPayload = {
    client?: InvoiceClient;
    items: InvoiceItem[];
    issueDate: string;
    total: number;
    taxAmount?: number;
    subtotal?: number;
    discountAmount?: number;
    retentionAmount?: number;
    paymentMethod?: PaymentMethod;
    receivedValue?: number;
    change?: number;
    notes?: string;
    currencyCode?: string;
    exchangeRate?: number;
    currencyTotal?: number;
    storeId?: string;
    companyId?: string;
    cashSessionId?: string
};