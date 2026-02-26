import { z } from "zod";

export const stockSchema = z.object({
  quantity: z.number().min(0, "Quantidade deve ser maior ou igual a 0"),
  itemsId: z.string().trim().min(1, "Produto é obrigatório"),
  storeId: z.string().trim().min(1, "Loja é obrigatória"),
  reserved: z
    .number()
    .min(0, "Reservado deve ser maior ou igual a 0")
    .optional(),
});

export const stockAdjustSchema = z.object({
  adjustment: z.number().min(1, "Ajuste deve ser maior que 0"),
  reason: z.string().trim().min(3, "Motivo deve ter pelo menos 3 caracteres"),
});

export const stockReserveSchema = z.object({
  amount: z.number().min(1, "Quantidade deve ser maior que 0"),
  reason: z.string().trim().min(3, "Motivo deve ter pelo menos 3 caracteres"),
});

export const stockUnreserveSchema = z.object({
  amount: z.number().min(1, "Quantidade deve ser maior que 0"),
  reason: z.string().trim().min(3, "Motivo deve ter pelo menos 3 caracteres"),
});

export type StockFormData = z.infer<typeof stockSchema>;
export type StockAdjustFormData = z.infer<typeof stockAdjustSchema>;
export type StockReserveFormData = z.infer<typeof stockReserveSchema>;
export type StockUnreserveFormData = z.infer<typeof stockUnreserveSchema>;
