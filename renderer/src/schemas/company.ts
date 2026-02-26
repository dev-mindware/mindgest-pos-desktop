import { z } from "zod";
import { phoneNumberSchema, taxNumberSchema } from "./helps";

export const companySchema = z.object({
  taxNumber: taxNumberSchema,
  name: z
    .string()
    .trim()
    .nonempty("Campo obrigatorio")
    .min(3, "No minimo 3 caracters"),
  address: z.string().trim().nonempty("Campo obrigatorio"),
  phone: phoneNumberSchema,
  email: z.string().trim().email("Email invalido"),
  website: z.string().trim().optional().nullable(),
  logo: z.string().trim().optional(),
});
