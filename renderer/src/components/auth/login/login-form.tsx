"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/brand.png";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "@/utils/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/schemas";
import { ButtonSubmit, GoogleButton, Input, OrLine } from "@/components";
import { loginAction } from "@/actions/login";
import { useAuthStore } from "@/stores";

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  async function handleLogin({ email, password }: LoginFormData) {
    try {
      const res = await loginAction({ email, password });

      if (!res.user) {
        ErrorMessage(res.message || "Erro ao tentar fazer login.");
        return;
      }

      setUser(res.user);
      router.replace(res.redirectPath || "/");
    } catch (error) {
      console.error(error);
      ErrorMessage("Ocorreu um erro inesperado. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image src={Logo} alt="Logo" className="size-20" />
        <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
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
        <div className="flex flex-col space-y-2 items-center">
          <Input
            label="Senha"
            startIcon="Lock"
            type="password"
            placeholder="Insira a senha"
            {...register("password")}
            autoComplete="current-password"
          />
          <Link
            href="/auth/forgot-password"
            className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        <ButtonSubmit isLoading={isSubmitting}>
          {isSubmitting ? "" : "Entrar"}
        </ButtonSubmit>

        {/* <OrLine />
        <GoogleButton /> */}
      </div>
      <div className="text-sm text-center">
        Não tem uma conta?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Crie nova
        </Link>
      </div>
    </form>
  );
}
