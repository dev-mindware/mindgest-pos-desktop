"use client";

import { Input, Label } from "@/components";
import type { User } from "@/types";

interface ProfileFormProps {
    user: User | null;
}

export function ProfileForm({ user }: ProfileFormProps) {
    if (!user) return null;

    const [firstName, ...lastNameParts] = (user.name || "").split(" ");
    const lastName = lastNameParts.join(" ");

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <Label>Nome</Label>
                <Input defaultValue={firstName} />
            </div>
            <div>
                <Label>Sobrenome</Label>
                <Input defaultValue={lastName} />
            </div>
            <div>
                <Label>Nome da Empresa</Label>
                <Input defaultValue={user.company?.name || ""} />
            </div>
            <div>
                <Label>NIF</Label>
                <Input defaultValue={user.company?.taxNumber || ""} placeholder="Ex: 598364343" />
            </div>
        </div>
    );
}
