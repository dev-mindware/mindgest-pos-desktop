"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/utils/messages";
import { useModal } from "@/stores";
import { StoreFormData, storeSchema } from "@/schemas";
import { Button, Input, GlobalModal, ButtonSubmit } from "@/components";
import { currentStoreStore } from "@/stores/entities/current-store-store";
import { useAddStore, useUpdateStore } from "@/hooks/entities";

type StoreModalProps = {
  action: "add" | "edit";
};

export function StoreModal({ action }: StoreModalProps) {
  const { closeModal, open } = useModal();
  const isOpen = open["add-store"] || open["edit-store"];
  const { currentStore } = currentStoreStore();

  const { mutateAsync: addStore, isPending: isAdding } = useAddStore();
  const { mutateAsync: editStore, isPending: isEditing } = useUpdateStore();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (action === "edit" && currentStore) {
      reset({
        name: currentStore.name,
        email: currentStore.email,
        phone: currentStore.phone,
        address: currentStore.address,
      });
    }
  }, [action, currentStore, reset]);

  async function onSubmit(data: StoreFormData) {
    try {
      const finalData = data;

      if (action === "add") {
        await addStore(finalData);
      } else if (action === "edit" && currentStore) {
        await editStore({ id: currentStore.id, data: finalData });
      }

      handleCancel();
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message || "Ocorreu um erro ao salvar a loja."
      );
    }
  }

  const handleCancel = () => {
    reset();
    closeModal(action === "add" ? "add-store" : "edit-store");
  };

  if ((action === "edit" && !currentStore) || !isOpen) return null;

  console.log(errors)

  return (
    <GlobalModal
      canClose
      id={action === "add" ? "add-store" : "edit-store"}
      title={action === "add" ? "Adicionar Loja" : "Editar Loja"}
      className="!max-h-[85vh] !w-max"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            startIcon="User"
            placeholder="Ex: Loja Central"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Telefone"
            startIcon="Phone"
            maxLength={9}
            placeholder="9xxxxxxxx"
            {...register("phone")}
            error={errors.phone?.message}
          />

          <Input
            type="email"
            label="Email"
            startIcon="Mail"
            placeholder="Ex: loja@example.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Endereço"
            placeholder="Ex: Rua da Independência, 123"
            startIcon="MapPin"
            {...register("address")}
            error={errors.address?.message}
          />
        </div>

        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <ButtonSubmit
            className="w-max"
            isLoading={isSubmitting || isAdding || isEditing}
          >
            {action === "add" ? "Adicionar" : "Salvar Alterações"}
          </ButtonSubmit>
        </div>
      </form>
    </GlobalModal>
  );
}
