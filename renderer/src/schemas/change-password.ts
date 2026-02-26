import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .nonempty("Campo obrigatório")
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula (A-Z)")
      .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula (a-z)")
      .regex(/[0-9]/, "Deve conter pelo menos um número (0-9)")
      .regex(/[^a-zA-Z0-9]/, "Deve conter pelo menos um caractere especial"),
    passwordConfirmation: z
      .string()
      .trim()
      .nonempty("Campo obrigatorio")
      .min(3, "No minimo 3 caracters"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
