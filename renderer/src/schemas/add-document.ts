import { z } from "zod";
import { ItemSchema, phoneNumberSchema, taxNumberSchema } from "./helps";

export const CompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome da empresa precisa ter pelo menos 3 caracteres")
    .optional(),
  taxNumber: taxNumberSchema.optional(),
  address: z
    .string()
    .trim()
    .min(5, "O endereço deve ter pelo menos 5 caracteres")
    .optional(),
  contact: phoneNumberSchema.optional(),
});

export type CompanyFormData = z.infer<typeof CompanySchema>;

const ClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome do cliente precisa ter pelo menos 3 caracteres"),
  taxNumber: taxNumberSchema.optional(),
  address: z
    .string()
    .trim()
    .min(5, "O endereço deve ter pelo menos 5 caracteres"),
  phone: phoneNumberSchema.optional(),
  email: z.string().trim().email("O email informado não é válido").optional(),
});

/**
 * Pagamento
 */

const PaymentSchema = z.object({
  method: z.enum(["bank_transfer", "cash", "card"], {
    errorMap: () => ({ message: "O método de pagamento é obrigatório" }),
  }),
  bankDetails: z
    .string()
    .trim()
    .min(5, "Os detalhes bancários devem ter pelo menos 5 caracteres")
    .optional(),
});

// schema base

const InvoiceBaseSchema = z.object({
  company: CompanySchema.optional(),
  client: ClientSchema,
  clientId: z.string().trim().optional(),
  categoryId: z.union([z.string().trim(), z.number()]).optional(),
  issueDate: z.string().trim().min(1, "A data de emissão é obrigatória"),
  orderReference: z.string().trim().optional(),
  items: z.array(ItemSchema).min(1, "A proforma deve conter pelo menos 1 item"),
  discount: z.number().optional(),
  globalRetention: z.number().min(0),

  globalDiscount: z.number().min(0),
  notes: z.string().optional(),
});

/**
 * Invoice (Fatura normal)
 */

export const InvoiceSchema = InvoiceBaseSchema.extend({
  storeId: z.string().trim(),
  dueDate: z.string().trim().min(1, "A data de vencimento é obrigatória"),
}).refine(
  (data) => {
    if (!data.issueDate || !data.dueDate) return true;
    return new Date(data.dueDate) >= new Date(data.issueDate);
  },
  {
    message: "A data de vencimento não pode ser anterior à data de emissão",
    path: ["dueDate"],
  },
);

export type InvoiceFormData = z.infer<typeof InvoiceSchema>;

export const ProformaSchema = InvoiceBaseSchema.extend({
  proformaExpiresAt: z.string().trim().min(1, "Campo obrigatório"),
  paymentMethod: z
    .string()
    .trim()
    .nonempty("O método de pagamento é obrigatório"),
  storeId: z.string().trim().optional(),
}).refine(
  (data) => {
    if (!data.issueDate || !data.proformaExpiresAt) return true;
    return new Date(data.proformaExpiresAt) >= new Date(data.issueDate);
  },
  {
    message: "A data de vencimento não pode ser anterior à data de emissão",
    path: ["proformaExpiresAt"],
  },
);
export type ProformaFormData = z.infer<typeof ProformaSchema>;

export const InvoiceReceiptSchema = InvoiceBaseSchema.extend({
  paymentMethod: z
    .string()
    .trim()
    .nonempty("O método de pagamento é obrigatório")
    .optional(),
  storeId: z.string().trim(),
  dueDate: z.string().trim().optional(),
}).refine(
  (data) => {
    if (!data.issueDate || !data.dueDate) return true;
    return new Date(data.dueDate) >= new Date(data.issueDate);
  },
  {
    message: "A data de vencimento não pode ser anterior à data de emissão",
    path: ["dueDate"],
  },
);
export type InvoiceReceiptFormData = z.infer<typeof InvoiceReceiptSchema>;

/**
 * Receipt (Recibo gerado de fatura)
 */
export const ReceiptSchema = z.object({
  issueDate: z.string().trim().min(1, "A data de emissão é obrigatória"),
  total: z.string().trim().nonempty("Campo obrigatório"),
  paymentMethod: z.enum(["CASH", "CARD", "TRANSFER"], {
    errorMap: () => ({ message: "O método de pagamento é obrigatório" }),
  }),
  notes: z.string().trim().optional(),
  originalInvoiceId: z.string().trim().nonempty("Campo obrigatório"),
  taxAmount: z.string().trim().nonempty("Campo obrigatório"),
  discountAmount: z.string().trim().nonempty("Campo obrigatório"),
  retentionAmount: z.string().trim().nonempty("Campo obrigatório"),
});

export type ReceiptFormData = z.infer<typeof ReceiptSchema>;
