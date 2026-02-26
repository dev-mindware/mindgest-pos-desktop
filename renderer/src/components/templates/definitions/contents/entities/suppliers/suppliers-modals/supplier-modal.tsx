"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/utils/messages";
import { useModal } from "@/stores";
import { SupplierFormData, supplierSchema } from "@/schemas";
import { Button, Input, GlobalModal, ButtonSubmit } from "@/components";
import { currentSupplierStore } from "@/stores/entities";
import { useAddSupplier, useUpdateSupplier } from "@/hooks/entities/use-suppliers";

type SupplierModalProps = {
  action: "add" | "edit";
};

export function SupplierModal({ action }: SupplierModalProps) {
  const { closeModal, open } = useModal();
  const isOpen = open["add-supplier"] || open["edit-supplier"];
  const { currentSupplier } = currentSupplierStore();

  const { mutateAsync: addSupplier, isPending: isAdding } = useAddSupplier();
  const { mutateAsync: editSupplier, isPending: isEditing } =
    useUpdateSupplier();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (action === "edit" && currentSupplier) {
      reset({
        name: currentSupplier.name,
        email: currentSupplier.email,
        phone: currentSupplier.phone,
        address: currentSupplier.address,
   /*      taxNumber: currentSupplier.taxNumber, */
     /*    iban: currentSupplier.taxNumber, */
      });
    }
  }, [action, currentSupplier, reset]);

  async function onSubmit(data: SupplierFormData) {
    try {
      const { /* iban */ ...finalData } = data;

      /* if (action === "add") {
        await addSupplier(finalData);
      } else if (action === "edit" && currentSupplier) {
        await editSupplier({ id: currentSupplier.id, data: finalData });
      } */

      handleCancel();
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message ||
          "Ocorreu um erro ao salvar o fornecedor."
      );
    }
  }

  const handleCancel = () => {
    reset();
    closeModal(action === "add" ? "add-supplier" : "edit-supplier");
  };

  if ((action === "edit" && !currentSupplier) || !isOpen) return null;

  return (
    <GlobalModal
      canClose
      id={action === "add" ? "add-supplier" : "edit-supplier"}
      title={action === "add" ? "Adicionar Fornecedor" : "Editar Fornecedor"}
      className="!max-h-[85vh] !w-max"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            startIcon="User"
            placeholder="Ex: Tech Solutions Ltd"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="NIF"
            startIcon="IdCard"
            placeholder="Ex: 546829403"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
           /*  {...register("taxNumber")}
            error={errors.taxNumber?.message} */
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
            placeholder="Ex: contact@techsolutions.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="IBAN"
            startIcon="FileDigit"
            placeholder="Ex: AO06004000005603309410251"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
           /*  {...register("iban")}
            error={errors.iban?.message} */
          />

          <Input
            label="Endereço"
            placeholder="Ex: Av. da Liberdade, 456"
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
