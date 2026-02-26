"use client";
import { Button, Input } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordFormData, changePasswordSchema } from "@/schemas";
import { ErrorMessage, SucessMessage } from "@/utils/messages";
import { useRouter } from "next/navigation";
import { useModal } from "@/stores";

export function UpdatePassword() {
  const router = useRouter();
  const { closeModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  async function onChangePassword(data: ChangePasswordFormData) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      SucessMessage("Senha alterada com sucesso!");
      closeModal("otp-modal");

      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.replace("/auth/login");
    } catch (error) {
      ErrorMessage("Ocorreu um erro ao enviar o email, Tente mais tarde.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onChangePassword)}
      className="flex items-center justify-center bg-red flex-1 px-4"
    >
      <div className="w-full space-y-4">
        <div className="space-y-4 flex ">
          <h1 className="text-2xl font-bold text-center">Actualizar Senha</h1>
        </div>
        <Input
          type="password"
          label="Nova Senha"
          {...register("password")}
          placeholder="Digite sua nova senha"
          error={errors.password && errors.password?.message}
        />
        <Input
          type="password"
          label="Confirmar Nova Senha"
          placeholder="Confirme sua nova senha"
          {...register("passwordConfirmation")}
          error={
            errors.passwordConfirmation && errors.passwordConfirmation?.message
          }
        />
        <Button loading={isSubmitting} className="w-full mb-2 mt-4">
          Verificar
        </Button>
      </div>
    </form>
  );
}
