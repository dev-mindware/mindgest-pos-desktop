"use client";

import { Button, Input, Label, Separator, Switch } from "@/components";
import type { User } from "@/types";

interface AccountSecurityProps {
    user: User | null;
}

export function AccountSecurity({ user }: AccountSecurityProps) {
    if (!user) return null;

    return (
        <div>
            <h3 className="text-2xl text-center md:text-start">Segurança da Conta</h3>
            <p className="text-center text-muted-foreground md:text-start">
                Altere as suas configurações de segurança.
            </p>
            <div className="mt-4 space-y-4">
                <div>
                    <Label>Email</Label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Input disabled defaultValue={user.email} className="w-[50%]" />
                        <Button className="whitespace-nowrap">Alterar Email</Button>
                    </div>
                </div>
                <div>
                    <Label>Senha</Label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Input type="password" value="************" disabled className="w-[50%]" />
                        <Button>Alterar Senha</Button>
                    </div>
                </div>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <Label>Autenticação de 2 passos</Label>
                        <p className="text-xs text-muted-foreground">
                            Implemente uma camada adicional de segurança à sua conta durante o login
                        </p>
                    </div>
                    <Switch />
                </div>
            </div>
        </div>
    );
}
