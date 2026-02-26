/* import { z } from "zod";
import { phoneNumberSchema } from "./helps";
const InvoiceBaseSchema = z.object({
  company: CompanySchema.optional(),
  client: {
    name: z.string().trim().min(3, "O nome do cliente precisa ter pelo menos 3 caracteres"),
    address: z.string().trim().min(5, "O endereço deve ter pelo menos 5 caracteres"),
    phone: phoneNumberSchema.optional(),
  },
  clientId: z.string().trim().optional(),
  categoryId: z.union([z.string().trim(), z.number()]).optional(),
  issueDate: z.string().trim().min(1, "A data de emissão é obrigatória"),
  orderReference: z.string().trim().optional(),
  items: z.array(ItemSchema).min(1, "A proforma deve conter pelo menos 1 item"),
  discount: z.number().optional(),
  globalTax: z.number().min(0),
  globalDiscount: z.number().min(0),
  notes: z.string().trim().optional(),
});

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
  }
);
export type InvoiceReceiptFormData = z.infer<typeof InvoiceReceiptSchema>;
 */
