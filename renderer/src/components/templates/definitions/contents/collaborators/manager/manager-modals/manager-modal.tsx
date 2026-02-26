"use client";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/utils/messages";
import { ManagerFormData, managerSchema } from "@/schemas";
import { useModal, currentManagerStore, currentStoreStore } from "@/stores";
import { Button, Input, GlobalModal, ButtonSubmit, Icon, MultiSelect } from "@/components";
import { useAddManager, useUpdateManager } from "@/hooks/collaborators";
import { useGetStores } from "@/hooks/entities";

type ManagerModalProps = {
  action: "add" | "edit";
};

export function ManagerModal({ action }: ManagerModalProps) {
  const { stores } = useGetStores();
  const { closeModal, open, openModal } = useModal();
  const { currentManager } = currentManagerStore();
  const isOpen = open["add-manager"] || open["edit-manager"];
  const { currentStore } = currentStoreStore();
  const [selectedStores, setSelectedStores] = useState<
    { label: string; value: string }[]
  >([]);

  const { mutateAsync: addManager, isPending: isAdding } = useAddManager();
  const { mutateAsync: editManager, isPending: isEditing } = useUpdateManager();

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ManagerFormData>({
    resolver: zodResolver(managerSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (action === "edit" && currentManager) {
      reset({
        name: currentManager.name,
        phone: currentManager.phone,
        storeIds: [currentStore?.id],
      });
    } else {
      setSelectedStores([]);
    }
  }, [action, currentManager, reset]);

  async function onSubmit(data: ManagerFormData) {
    try {
      const { password, ...finalData } = data;

      if (action === "add") {
        await addManager(data);
      } else if (action === "edit" && currentManager) {
        await editManager({
          id: currentManager.id,
          data: {
            name: finalData.name,
            phone: finalData.phone,
            storeIds: finalData.storeIds,
          },
        });
      }

      handleCancel();
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message || "Ocorreu um erro ao salvar o gerente."
      );
    }
  }

  const handleCancel = () => {
    reset();
    setSelectedStores([]);
    closeModal(action === "add" ? "add-manager" : "edit-manager");
  };

  if ((action === "edit" && !currentManager) || !isOpen) return null;

  return (
    <GlobalModal
      canClose
      className="!max-h-[85vh] !w-max"
      id={action === "add" ? "add-manager" : "edit-manager"}
      title={action === "add" ? "Adicionar Gerente" : "Editar Gerente"}
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
            label="Telefone"
            startIcon="Phone"
            maxLength={9}
            placeholder="9xxxxxxxx"
            {...register("phone")}
            error={errors.phone?.message}
          />

          {action === "add" && (
            <>
              <Input
                type="email"
                label="Email"
                startIcon="Mail"
                placeholder="Ex: cea.co@gmail.com"
                {...register("email")}
                error={errors.email?.message}
              />

              <Input
                label="Senha"
                startIcon="Lock"
                placeholder="Ex: 12345678"
                {...register("password")}
                error={errors.password?.message}
              />
            </>
          )}

          <div className="flex items-end gap-2 sm:col-span-2">
            <Controller
              name="storeIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Lojas"
                  className="w-full"
                  options={stores}
                  value={selectedStores}
                  isLoading={!stores.length}
                  onChange={(options) => {
                    setSelectedStores(options);
                    field.onChange(options.map((o) => o.value));
                  }}
                  error={errors.storeIds?.message}
                />
              )}
            />
          </div>
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
