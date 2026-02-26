import { z } from "zod";
import { phoneNumberSchema, taxNumberSchema } from "./helps";

export const supplierSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.enum(["emp", "par"], {
    required_error: "Selecione o tipo de fornecedor",
  }),
  phone: phoneNumberSchema,
  email: z.string().trim().email("Email inválido"),
  nif: taxNumberSchema,
  address: z.string().trim().min(5, "Endereço muito curto"),
  supplyType: z.enum(["src", "prd", "amb"], {
    required_error: "Selecione o tipo de fornecimento",
  }),
  deliveryTime: z.string().trim().min(2, "Informe o prazo de entrega"),
  products: z
    .array(z.string().trim())
    .min(1, "Adicione pelo menos um produto ou categoria"),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
