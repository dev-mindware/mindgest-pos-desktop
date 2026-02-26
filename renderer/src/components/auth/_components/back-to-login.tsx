import Link from "next/link"; 

export function BackToLogin() {
  return (
    <Link href="/auth/login" className="w-full text-center text-primary block">
      Voltar para o login
    </Link>
  );
}
