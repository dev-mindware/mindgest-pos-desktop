import { z } from "zod";
import { companySchema } from "./company";
import { passwordSchema, phoneNumberSchema } from "./helps";

export const registerSchema = z.object({
  step1: z
    .object({
      name: z
        .string()
        .trim()
        .nonempty("Campo obrigatorio")
        .min(3, "No minimo 3 caracters"),
      email: z.string().trim().email("Email invalido"),
      phone: phoneNumberSchema,
      password: passwordSchema,
      passwordConfirmation: z
        .string()
        .trim()
        .nonempty("Campo obrigatorio")
        .min(3, "No minimo 3 caracters"),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "As senhas não coincidem",
      path: ["passwordConfirmation"],
    }),
  step2: z.object({
    company: companySchema,
  }),
  step3: z.object({
    terms: z.literal(true, {
      errorMap: () => ({ message: "Você deve aceitar os termos" }),
    }),
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
