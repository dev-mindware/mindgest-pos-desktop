import { Client } from "./clients";
import { InvoiceStatus } from "./documents";
import { PaymentMethod } from "./receipt";

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number; 
}

export interface InvoiceDetails {
  id: string;
  invoiceNumber: string;
  invoiceType: 'NORMAL_INVOICE' | string; 
  status: 'CANCELLED' | 'PAID' | 'PENDING' | string; 
  isPaid: boolean;
  clientId: string;
  clientName: string;
  clientEmail: string;
  issueDate: string; 
  dueDate: string; 
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number; 
  notes: string | null;
  createdAt: string; 
  updatedAt: string; 
}

export type ReceiptDetails = {
  id: string;
  receiptNumber: string;
  receiptType: "RECEIPT"; 
  clientId: string;
  clientName: string;
  clientEmail: string;
  issueDate: string; 
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  retentionAmount: number;
  totalAmount: number;
  receivedValue: number;
  changeAmount: number;
  paymentMethod: "CASH" | "CARD" | "TRANSFER"; 
  originalInvoiceId: string | null;
  notes?: string | null;
  operatorId?: string;
  operatorName?: string;
  createdAt: string; 
  updatedAt: string; 
};











export type InvoiceType = InvoiceDetails;

export interface CreditNotesResponse {
  id: string
  number: string
  reason: "CORRECTION" | "CANCELLATION";
  status: string
  notes: string
  userId: string
  createdAt: string
  updatedAt: string
  items: ItemSimple[]
  client: Client
  invoice: Invoice
}

export interface ItemSimple {
  id: string
  quantity: number
  price: string
  total: string
  invoiceId: string
  itemsId: string
  taxId: string
}

export interface Invoice {
  id: string
  number: string
  status: string
  subtotal: string
  taxAmount: string
  retentionAmount: string
  discountAmount: string
  total: string
  notes: string
  paidAt: string
  paymentMethod: PaymentMethod,
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface CreditNoteFilters {
  reason: "CORRECTION" | "RETURN" | "DISCOUNT" | "CANCELLATION" | string | null;
  status?: InvoiceStatus | null;
  creditNoteNumber: string | null;
  sortBy: string | null;
  sortOrder: string | null;
  startDate: string | null;
  endDate: string | null;
}

// criação de nota de credito

export interface InvoiceBody {
  client: Client
  items: ItemBody[]
  issueDate: string
  dueDate: string
  total: number
  taxAmount: number
  subtotal: number
  discountAmount: number
  notes: string
}

export interface ItemBody {
  id: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export type FullItem = ItemSimple & {
  name: string
  description: string
  sku: string
  barcode: string
  cost: number
  type: string
  minStock: number
  maxStock: number
  unit: string
  weight: number
  dimensions: string
  image: string
  hasExpiry: boolean
  expiryDate: string
  daysToExpiry: number
}
