"use client";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@/utils/messages";
import {
  Button,
  GlobalModal,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  UpdatePassword,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, OtpFormData } from "@/schemas";
import { useModal } from "@/stores";
import { useState } from "react";

export function OTPModal({ email }: { email: string }) {
  const { closeModal } = useModal();
  const [canChangePassword, setCanChangePassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  async function onSubmit(data: OtpFormData) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCanChangePassword(true);
    } catch (error) {
      ErrorMessage((error as string) || "Ocorreu um erro desconhecido");
    }
  }

  async function resendCode() {
    try {
    } catch (error) {}
  }

  return (
    <GlobalModal id="otp-modal" className="p-0 w-max!">
      {!canChangePassword ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid justify-center gap-6 px-4 py-6 text-center"
        >
          <h1 className="text-2xl font-bold">Verificação OTP</h1>
          <p className="text-sm text-muted-foreground">
            A nossa equipa enviou um email com o código de verificação para{" "}
            <br />
            <span className="font-medium text-foreground">{email}</span>
            <Button
              variant="link"
              onClick={() => closeModal("otp-modal")}
              className="text-primary hover:underline"
            >
              Mudar Email
            </Button>
          </p>
          <div className="flex items-center justify-center w-full">
            <Controller
              name="otpCode"
              control={control}
              render={({ field }) => (
                <InputOTP className="w-full h-full" maxLength={6} {...field}>
                  <InputOTPGroup>
                    {[...Array(3)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-muted-foreground" />
                  <InputOTPGroup>
                    {[...Array(3)].map((_, i) => (
                      <InputOTPSlot key={i + 3} index={i + 3} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>
          <Button loading={isSubmitting} className="w-full">
            Verificar Conta
          </Button>
          <Button
            variant="link"
            onClick={resendCode}
            className="text-sm font-medium text-primary hover:underline"
          >
            Reenviar o código
          </Button>
        </form>
      ) : (
        <UpdatePassword />
      )}
    </GlobalModal>
  );
}
