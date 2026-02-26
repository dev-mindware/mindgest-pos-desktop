"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/utils/messages";
import { useModal, currentClientStore } from "@/stores";
import { ClientFormData, clientSchema } from "@/schemas";
import { useAddClient, useUpdateClient } from "@/hooks/entities";
import { Button, Input, GlobalModal, ButtonSubmit } from "@/components";

type ClientModalProps = {
  action: "add" | "edit";
};

export function ClientModal({ action }: ClientModalProps) {
  const { closeModal, open } = useModal();
  const isOpen = open["add-client"] || open["edit-client"];
  const { currentClient } = currentClientStore();
  const { mutateAsync: addClient, isPending: isAdding } = useAddClient();
  const { mutateAsync: editClient, isPending: isEditing } = useUpdateClient();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (action === "edit" && currentClient) {
      reset({
        name: currentClient.name,
        email: currentClient.email,
        phone: currentClient.phone,
        address: currentClient.address,
        taxNumber: currentClient.taxNumber,
      });
    }
  }, [action, currentClient, reset]);

  async function onSubmit(data: ClientFormData) {
    try {
      const finalData = {
        ...data,
        email: data.email || undefined,
        address: data.address || undefined,
      };

      if (action === "add") {
        await addClient(finalData as any);
      } else if (action === "edit" && currentClient) {
        await editClient({ id: currentClient.id, data: finalData as any });
      }

      handleCancel();
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message ||
        "Ocorreu um erro ao salvar o cliente."
      );
    }
  }

  const handleCancel = () => {
    reset();
    closeModal(action === "add" ? "add-client" : "edit-client");
  };

  if ((action === "edit" && !currentClient) || !isOpen) return null;

  return (
    <GlobalModal
      canClose
      id={action === "add" ? "add-client" : "edit-client"}
      title={action === "add" ? "Adicionar Cliente" : "Editar Cliente"}
      className="!max-h-[85vh] !w-max"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            startIcon="User"
            placeholder="Ex: Ceara Coveney"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="NIF"
            startIcon="IdCard"
            placeholder="Ex: 546829403"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            {...register("taxNumber")}
            error={errors.taxNumber?.message}
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
            placeholder="Ex: cea.co@gmail.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Endereço"
            placeholder="Ex: Av. Pedro Castro"
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
