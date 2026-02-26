"use client";

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
import { useModal } from "@/stores";
import { ItemFormData, itemSchema } from "@/schemas";
import { useUpdateItem, useGetCategories, useGetTaxes, useAuth } from "@/hooks";
import { ErrorMessage } from "@/utils/messages";
import { useMemo } from "react";
import { ItemResponse } from "@/types";

interface EditProductModalProps {
  product: ItemResponse;
}

export function EditProductModal({ product }: EditProductModalProps) {
  const { open, openModal, closeModal } = useModal();
  const isOpen = open["edit-product"];

  if (!isOpen) return null;

  return (
    <>
      <GlobalModal
        canClose
        id="edit-product"
        title={
          <div className="w-full flex items-center justify-between gap-2 mb-4">
            <span>Editar Produto</span>
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
        <EditProductFormContent product={product} />
      </GlobalModal>
      {open["add-category"] && <CategoryModal action="add" />}
    </>
  );
}

function EditProductFormContent({ product }: EditProductModalProps) {
  const { user } = useAuth();
  const { closeModal } = useModal();
  const { mutateAsync: updateItemMutate, isPending: isUpdating } = useUpdateItem();

  const {
    categoryOptions,
    isLoading: isLoadingCategories,
    isError,
    refetch,
    pagination,
    setPage,
  } = useGetCategories();
  const { taxOptions, isLoading: isTaxesLoading } = useGetTaxes();

  const finalCategoryOptions = useMemo(() => {
    const currentId = product.categoryId || (product as any).category_id;
    const currentName = product.category;

    if (currentId && currentName && !categoryOptions.find((o) => o.value === currentId)) {
      return [{ label: currentName, value: currentId }, ...categoryOptions];
    }
    return categoryOptions;
  }, [product, categoryOptions]);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: product.name || "",
      description: product.description || "",
      barcode: product.barcode || "",
      price: Number(product.price) || 0,
      cost: product.cost != null ? Number(product.cost) : undefined,
      quantity: product.quantity != null ? Number(product.quantity) : undefined,
      minStock: product.minStock != null ? Number(product.minStock) : undefined,
      maxStock: product.maxStock != null ? Number(product.maxStock) : undefined,
      unit: product.unit || "",
      weight: product.weight != null ? Number(product.weight) : undefined,
      dimensions: product.dimensions || "",
      type: "PRODUCT",
      companyId: String(user?.company?.id),
      categoryId: product.categoryId || (product as any).category_id || "",
      taxId: product.taxId || product.tax?.id || "",
      expiryDate: product.expiryDate || "",
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
      const { type, companyId, ...rest } = cleanedData;

      await updateItemMutate({
        id: product.id,
        data: rest,
      });
      handleCancel();
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message || "Ocorreu um erro ao atualizar o item"
      );
    }
  }

  const handleCancel = () => {
    reset();
    closeModal("edit-product");
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
                  options={finalCategoryOptions}
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
                {...register("daysToExpiry", { valueAsNumber: true })}
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
          <ButtonSubmit className="w-max" isLoading={isUpdating || isSubmitting}>
            Atualizar
          </ButtonSubmit>
        </div>
      </div>
    </form>
  );
}