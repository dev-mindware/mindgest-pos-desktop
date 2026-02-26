"use client";

import { Button, Separator, Switch, Label } from "@/components";

export function SupportAccess() {
    return (
        <div>
            <h3 className="text-2xl text-center md:text-start">Suporte de Acesso</h3>
            <p className="text-center text-muted-foreground md:text-start">
                Altere as suas configurações de suporte de acesso.
            </p>
            <Separator className="mt-4" />
            <div className="mt-4 space-y-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <Label>Suporte de Acesso</Label>
                        <p className="text-xs text-muted-foreground">
                            Concede-nos acesso à sua conta para efeitos de suporte até 19 de junho de 2025,
                            11h43.
                        </p>
                    </div>
                    <Switch />
                </div>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <p className="text-sm text-muted-foreground">Log out em todos os dispositivos</p>
                    <Button variant="outline">Log out</Button>
                </div>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-destructive">Eliminar minha conta</p>
                        <p className="text-xs text-muted-foreground">
                            Eliminar definitivamente a conta e remover o acesso de todos os espaços de trabalho
                        </p>
                    </div>
                    <Button variant="destructive">Eliminar Conta</Button>
                </div>
            </div>
        </div>
    );
}
