"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
} from "@/components/ui";
import { useClientActions } from "@/hooks";
import { useEffect } from "react";

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  taxNumber: z.string().min(9, "NIF deve ter pelo menos 9 dígitos"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any;
  onSuccess?: () => void;
}

export function ClientModal({ isOpen, onClose, client, onSuccess }: ClientModalProps) {
  const { upsertClient } = useClientActions();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      taxNumber: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (client) {
      form.reset({
        id: client.id,
        name: client.name,
        taxNumber: client.taxNumber || "",
        email: client.email || "",
        phone: client.phone || "",
      });
    } else {
      form.reset({
        name: "",
        taxNumber: "",
        email: "",
        phone: "",
      });
    }
  }, [client, form, isOpen]);

  const onSubmit = async (data: ClientFormValues) => {
    try {
      await upsertClient(data);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{client ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome / Razão Social</Label>
            <Input id="name" {...form.register("name")} placeholder="Ex: João da Silva" />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxNumber">NIF</Label>
            <Input id="taxNumber" {...form.register("taxNumber")} placeholder="Ex: 500123456" />
            {form.formState.errors.taxNumber && (
              <p className="text-xs text-red-500">{form.formState.errors.taxNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} placeholder="exemplo@gmail.com" />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" {...form.register("phone")} placeholder="Ex: 923 000 000" />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "A guardar..." : "Guardar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
