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
import { useItemActions } from "@/hooks";
import { useEffect } from "react";

const itemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  sku: z.string().optional(),
  price: z.coerce.number().min(0, "Preço não pode ser negativo"),
  quantity: z.coerce.number().min(0, "Quantidade não pode ser negativa"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  onSuccess?: () => void;
}

export function ItemModal({ isOpen, onClose, item, onSuccess }: ItemModalProps) {
  const { upsertItem } = useItemActions();
  
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      quantity: 0,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        id: item.id,
        name: item.name,
        sku: item.sku || "",
        price: item.price || 0,
        quantity: item.quantity || 0,
      });
    } else {
      form.reset({
        name: "",
        sku: "",
        price: 0,
        quantity: 0,
      });
    }
  }, [item, form, isOpen]);

  const onSubmit = async (data: ItemFormValues) => {
    try {
      await upsertItem(data);
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
          <DialogTitle>{item ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input id="name" {...form.register("name")} placeholder="Ex: Coca-Cola 330ml" />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sku">SKU / Referência</Label>
            <Input id="sku" {...form.register("sku")} placeholder="Ex: REF-001" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (AOA)</Label>
              <Input id="price" type="number" step="0.01" {...form.register("price")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Stock Inicial</Label>
              <Input id="quantity" type="number" {...form.register("quantity")} />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "A guardar..." : "Guardar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
