"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Button,
  Textarea,
  GlobalModal,
  RHFSelect,
  RequestError,
  ButtonSubmit,
  CategoryModal,
  ProductModalSkeleton,
  FeatureGate,
  InputCurrency,
} from "@/components";
import { PaginatedSelect } from "@/components/shared";
import { useModal, currentStoreStore } from "@/stores";
import { ItemFormData, itemSchema } from "@/schemas";
import { useAddItem, useGetCategories, useGetTaxes, useAuth } from "@/hooks";
import { ErrorMessage } from "@/utils/messages";
import { taxExemptionReasons } from "@/constants/tax-exemption";

export function AddProductModal() {
  const { open, openModal, closeModal, modalData } = useModal();
  const isOpen = open["add-product"];

  if (!isOpen) return null;

  return (
    <>
      <GlobalModal
        canClose
        id="add-product"
        title={
          <div className="w-full flex items-center justify-between gap-2 mb-4">
            <span>Adicionar Produto</span>
            <Button
              size="sm"
              className="sticky right-0"
              variant="outline"
              onClick={() => openModal("add-category")}
            >
              Adicionar Categoria
            </Button>
          </div>
        }
        className="!max-h-[85vh] !w-max"
      >
        <AddProductFormContent />
      </GlobalModal>
      {open["add-category"] && <CategoryModal action="add" />}
    </>
  );
}

function AddProductFormContent() {
  const { user } = useAuth();
  const { closeModal, modalData } = useModal();
  const [exemptionPage, setExemptionPage] = useState(1);
  const { currentStore } = currentStoreStore();
  const { mutateAsync: addItemMutate, isPending: isAdding } = useAddItem();

  const {
    categoryOptions,
    isLoading: isLoadingCategories,
    isError,
    refetch,
    pagination,
    setPage,
  } = useGetCategories();
  const { taxOptions, isLoading: isTaxesLoading } = useGetTaxes();

  const initialBarcode = modalData["add-product"]?.barcode || "";

  const {
    reset,
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      barcode: initialBarcode,
      price: 0,
      cost: undefined,
      companyId: String(user?.company?.id),
      type: "PRODUCT",
      taxId: "",
      categoryId: "",
      exemptionCode: "",
    },
  });

  const cleanPayload = (data: ItemFormData) => {
    return {
      ...data,
      cost: data.cost ?? undefined,
      quantity: data.quantity ?? undefined,
      weight: data.weight ?? undefined,
      minStock: data.minStock ?? undefined,
      maxStock: data.maxStock ?? undefined,
      daysToExpiry: data.daysToExpiry ?? undefined,
    } as any;
  };

  async function onSubmit(data: ItemFormData) {
    try {
      const cleanedData = cleanPayload(data);
      await addItemMutate({
        ...cleanedData,
        ...(user?.role === "OWNER" && currentStore?.id && { storeId: currentStore?.id }),
      });
      handleCancel();
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message || "Ocorreu um erro ao adicionar o item"
      );
    }
  }

  const handleCancel = () => {
    reset();
    closeModal("add-product");
  };

  if (isLoadingCategories || isTaxesLoading) return <ProductModalSkeleton />;
  if (isError) {
    return (
      <RequestError
        refetch={refetch}
        message="Ocorreu um erro ao carregar as categorias"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 sm:grid-flow-col sm:auto-cols-fr"
    >
      <div className="">
        <div className="space-y-4 sm:w-[35rem]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nome"
              startIcon="Tag"
              {...register("name")}
              error={errors.name?.message}
              placeholder="Ex: Teclado Logitech"
            />
            <RHFSelect
              name="taxId"
              label="Imposto (Opcional)"
              options={taxOptions}
              control={control}
            />
          </div>

          {(() => {
            const taxId = watch("taxId");
            const selectedTax = taxOptions.find((t) => t.value === taxId);
            const taxRate = selectedTax
              ? Number(selectedTax.label.match(/\((\d+)%\)/)?.[1] || 0)
              : 0;

            if (taxRate === 0 && selectedTax) {
              const itemsPerPage = 6;
              const totalPages = Math.ceil(taxExemptionReasons.length / itemsPerPage);
              const paginatedOptions = taxExemptionReasons.slice(
                (exemptionPage - 1) * itemsPerPage,
                itemsPerPage * exemptionPage
              );

              return (
                <div className="grid grid-cols-1 gap-4">
                  <Controller
                    name="exemptionCode"
                    control={control}
                    render={({ field }) => (
                      <PaginatedSelect
                        label="Motivo de Isenção"
                        options={paginatedOptions}
                        value={field.value}
                        onChange={field.onChange}
                        pagination={{
                          page: exemptionPage,
                          totalPages: totalPages,
                        }}
                        onPageChange={setExemptionPage}
                        className="w-full"
                        error={errors.exemptionCode?.message}
                      />
                    )}
                  />
                </div>
              );
            }
            return null;
          })()}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <InputCurrency
                  ref={field.ref}
                  label="Preço Unitário"
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  error={errors.price?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="cost"
              render={({ field }) => (
                <InputCurrency
                  ref={field.ref}
                  label="Custo de Compra"
                  placeholder="0,00"
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  error={errors.cost?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="categoryId"
              render={({ field: { onChange, value } }) => (
                <PaginatedSelect
                  label="Categoria"
                  value={value}
                  options={categoryOptions}
                  onChange={onChange}
                  isLoading={isLoadingCategories}
                  pagination={pagination}
                  onPageChange={setPage}
                  placeholder="Selecione uma opção"
                  className="w-full"
                />
              )}
            />

            <RHFSelect
              name="type"
              label="Tipo"
              options={[{ label: "Produto", value: "PRODUCT" }]}
              control={control}
            />
          </div>

          <FeatureGate minPlan="Pro" fallback="hidden">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="quantity"
                startIcon="Scale"
                label="Stock Mínimo"
                {...register("minStock", { valueAsNumber: true })}
                error={errors.minStock?.message}
              />
              <Input
                type="quantity"
                startIcon="Scale"
                label="Stock Máximo"
                {...register("maxStock", { valueAsNumber: true })}
                error={errors.maxStock?.message}
              />
            </div>
          </FeatureGate>

          <div className="grid grid-cols-2 gap-4">
            <FeatureGate minPlan="Pro" fallback="hidden">
              <Input
                startIcon="Scale"
                {...register("unit")}
                label="Unidade de Medida (Opcional)"
                error={errors.unit?.message}
              />
            </FeatureGate>
            <Input
              type="quantity"
              startIcon="Scale"
              label="Quantidade"
              {...register("quantity", { valueAsNumber: true })}
              error={errors.quantity?.message}
            />
          </div>

          <FeatureGate minPlan="Pro" fallback="hidden">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                startIcon="Weight"
                label="Peso (Kg) (opcional)"
                {...register("weight", { valueAsNumber: true })}
                error={errors.weight?.message}
                placeholder="300Kg"
              />
              <Input
                label="Dimensões (opcional)"
                placeholder="Ex: 10x20x30 cm"
                {...register("dimensions")}
                error={errors.dimensions?.message}
              />
            </div>
          </FeatureGate>

          <FeatureGate minPlan="Pro" fallback="hidden">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Data de Validade (opcional)"
                {...register("expiryDate")}
                error={errors.expiryDate?.message}
              />
              <Input
                type="number"
                placeholder="14"
                label="Dias até Expirar (opcional)"
                {...register("daysToExpiry")}
                error={errors.daysToExpiry?.message}
              />
            </div>
          </FeatureGate>

          <Textarea
            label="Descrição (opcional)"
            {...register("description")}
            className="mt-1 min-h-[100px]"
            placeholder="Escreva detalhes do item..."
            error={errors.description?.message}
          />
        </div>

        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <ButtonSubmit className="w-max" isLoading={isAdding || isSubmitting}>
            Salvar
          </ButtonSubmit>
        </div>
      </div>
    </form>
  );
}
