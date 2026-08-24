"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "@/utils/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/schemas";
import { ButtonSubmit, Icon, Input } from "@/components";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/stores";

export function LoginForm() {
  const router = useRouter();
  const { setUser, setIsAuthenticating } = useAuthStore();
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.ipc?.security?.getSavedCredentials) {
      window.ipc.security.getSavedCredentials()
        .then((creds) => {
          if (creds?.email && creds?.password) {
            setValue("email", creds.email, { shouldValidate: true });
            setValue("password", creds.password, { shouldValidate: true });
            setRememberMe(true);
          }
        })
        .catch((err) => {
          console.warn("Não foi possível carregar credenciais guardadas:", err);
        });
    }
  }, [setValue]);

  async function handleLogin({ email, password }: LoginFormData) {
    try {
      const res = await authService.login({ email, password });

      if (!res.user) {
        ErrorMessage(res.message || "Erro ao tentar fazer login.");
        return;
      }

      // Guarda ou limpa credenciais com SafeVault (Windows DPAPI / Keychain)
      if (typeof window !== "undefined" && window.ipc?.security) {
        try {
          if (rememberMe) {
            await window.ipc.security.saveSavedCredentials({ email, password });
          } else {
            await window.ipc.security.clearSavedCredentials();
          }
        } catch (e) {
          console.warn("Erro ao persistir credenciais seguras:", e);
        }
      }

      setUser(res.user);
      setIsAuthenticating(false);
      router.replace(res.redirectPath || "/pos/counter");
    } catch (error) {
      console.error(error);
      ErrorMessage("Ocorreu um erro inesperado. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          src={"/mindgest.png"}
          alt="Logótipo do Mindgest"
          className="size-20 object-contain"
          width={100}
          height={100}
        />
        <h1 className="text-2xl font-bold">Bem-vindo(a) ao Mindgest</h1>
      </div>

      <div className="grid gap-6">
        <Input
          type="email"
          label="Email"
          startIcon="AtSign"
          placeholder="Endereço de email"
          {...register("email")}
          error={errors?.email && errors?.email?.message}
          autoComplete="email"
        />
        <div className="flex flex-col space-y-2">
          <Input
            label="Palavra-passe"
            startIcon="Lock"
            type="password"
            placeholder="Introduza a palavra-passe"
            {...register("password")}
            autoComplete="current-password"
          />
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-3.5 rounded border-muted-foreground/30 text-primary focus:ring-primary/20 accent-primary"
              />
              <span className="flex items-center gap-1">
                Lembrar neste computador
                <Icon name="ShieldCheck" className="w-3.5 h-3.5 text-emerald-500 inline" />
              </span>
            </label>
          </div>
        </div>

        <ButtonSubmit isLoading={isSubmitting}>
          {isSubmitting ? "" : "Entrar"}
        </ButtonSubmit>
      </div>

      <div className="text-sm text-center">
        Ainda não tem uma conta?{" "}
        <a
          href="https://mindgest.mindware.ao/auth/register"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Criar conta
        </a>
      </div>
    </form>
  );
}
