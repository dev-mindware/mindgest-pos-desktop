import { z } from "zod";

export const itemSchema = z
  .object({
    name: z.string().trim().min(1, "Campo obrigatório"),
    description: z.string().trim().optional(),
    barcode: z.string().trim().optional(),

    price: z.number({ invalid_type_error: "Preço deve ser um número" }),
    cost: z.number().nullable().optional(),
    quantity: z.number().nullable().optional(),

    minStock: z.number().nullable().optional(),
    maxStock: z.number().nullable().optional(),

    unit: z.string().trim().optional(),
    weight: z.number().nullable().optional(),
    dimensions: z.string().trim().optional(),
    image: z.string().trim().url("URL inválida").optional(),

    type: z.enum(["SERVICE", "PRODUCT"], {
      required_error: "Tipo obrigatório",
    }),

    companyId: z.string().trim().optional(),
    storeId: z.string().trim().optional(),
    categoryId: z.string().trim().min(1, "Campo obrigatório"),

    hasExpiry: z.boolean().optional(),
    expiryDate: z.string().trim().optional(),
    daysToExpiry: z.coerce.string().optional(),
    taxId: z.string().trim().optional().nullable(),
    exemptionCode: z.string().trim().optional(),
  })

  .refine(
    (data) => {
      if (
        data.maxStock !== undefined &&
        data.maxStock !== null &&
        data.minStock !== undefined &&
        data.minStock !== null
      ) {
        return data.maxStock >= data.minStock;
      }
      return true;
    },
    {
      message: "O stock máximo deve ser maior ou igual ao stock mínimo",
      path: ["maxStock"],
    },
  )
  .refine(
    (data) => {
      if (
        data.cost !== undefined &&
        data.cost !== null &&
        data.price !== undefined &&
        data.price !== null
      ) {
        return data.price >= data.cost;
      }
      return true;
    },
    {
      message: "O preço deve ser maior ou igual ao custo",
      path: ["price"],
    },
  );

export type ItemFormData = z.infer<typeof itemSchema>;
