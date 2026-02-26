import { z } from "zod";

export const CreditNoteSchema = z.object({
  reason: z.enum(["CORRECTION", "ANNULATION"]),
  invoiceBody: z
    .object({
      client: z.object({
        id: z.string().trim().nonempty("Campo obrigatório"),
        name: z.string().trim().nonempty("Campo obrigatório"),
        email: z.string().trim().nonempty("Campo obrigatório"),
      }),
      items: z
        .array(
          z.object({
            id: z.string().trim().min(1),
            quantity: z.number(),
            price: z.number(),
          }),
        )
        .optional(),
      issueDate: z.string().trim().date(),
      dueDate: z.string().trim().date(),
      total: z.number(),
      taxAmount: z.number(),
      subtotal: z.number(),
      discountAmount: z.number(),
    })
    .optional(),

  notes: z.string().trim().optional(),
});

export type CreditNoteFormData = z.infer<typeof CreditNoteSchema>;
