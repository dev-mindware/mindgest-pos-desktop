"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft, ShieldCheck } from "lucide-react";

export default function RegisterRedirectPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-8" />
        </div>

        <Image
          src="/mindgest.png"
          alt="Logótipo do Mindgest"
          className="mx-auto mb-4 h-12 w-auto object-contain"
          width={120}
          height={48}
        />

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Registo Exclusivo Online
        </h1>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Para garantir a segurança, emissão de licença e configuração da sua empresa,
          o registo de novas contas é efetuado exclusivamente através do nosso portal online.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href="https://mindgest.mindware.ao/auth/register"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full gap-2 text-base font-semibold" size="lg">
              Registar no Portal Online
              <ExternalLink className="size-4" />
            </Button>
          </a>

          <Link href="/auth/login">
            <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
              <ArrowLeft className="size-4" />
              Voltar ao Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
