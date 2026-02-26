import { z } from "zod";
import { phoneNumberSchema } from "./helps";

export const storeSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().trim().email("Email inválido"),
  phone: phoneNumberSchema,
  address: z.string().trim().min(5, "Endereço muito curto"),
  status: z.string().trim().optional(),
  manager: z.string().trim().optional(),
  companyId: z.string().trim().optional(),
});

export type StoreFormData = z.infer<typeof storeSchema>;
