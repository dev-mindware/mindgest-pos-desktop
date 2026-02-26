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
import { useModal, currentProductStore, currentStoreStore } from "@/stores";
import { ItemFormData, itemSchema } from "@/schemas";
import { useAddItem, useUpdateItem, useGetCategories, useGetTaxes, useAuth } from "@/hooks";
import { ErrorMessage } from "@/utils/messages";
import { useEffect, useMemo } from "react";

export function ProductModal() {
    const { open, openModal } = useModal();
    const isOpenAdd = open["add-product"];
    const isOpenEdit = open["edit-product"];
    const isOpen = isOpenAdd || isOpenEdit;
    const isEdit = !!isOpenEdit;

    return (
        <GlobalModal
            canClose
            id={isEdit ? "edit-product" : "add-product"}
            title={
                <div className="w-full flex items-center justify-between gap-2 mb-4">
                    <span>{isEdit ? "Editar Produto" : "Adicionar Producto"}</span>
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
            {isOpen ? (
                <ProductFormContent isEdit={isEdit} />
            ) : (
                <ProductModalSkeleton />
            )}
            {open["add-category"] && <CategoryModal action="add" />}
        </GlobalModal>
    );
}

function ProductFormContent({ isEdit }: { isEdit: boolean }) {
    const { user } = useAuth();
    const { closeModal, modalData } = useModal();
    const { currentStore } = currentStoreStore();
    const { currentProduct } = currentProductStore();
    const { mutateAsync: addItemMutate, isPending: isAdding } = useAddItem();
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

    const initialBarcode = modalData["add-product"]?.barcode || "";

    const finalCategoryOptions = useMemo(() => {
        if (!isEdit || !currentProduct) return categoryOptions;

        const currentId = currentProduct.categoryId || (currentProduct as any).category_id;
        const currentName = currentProduct.category;

        if (currentId && currentName && !categoryOptions.find((o) => o.value === currentId)) {
            return [{ label: currentName, value: currentId }, ...categoryOptions];
        }
        return categoryOptions;
    }, [isEdit, currentProduct, categoryOptions]);

    const {
        reset,
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            barcode: initialBarcode,
            price: 0,
            cost: 0,
            companyId: String(user?.company?.id),
            type: "PRODUCT",
            taxId: "",
            categoryId: currentProduct?.categoryId || "",
        },
    });

    // Pre-fill data when in edit mode
    useEffect(() => {
        if (isEdit && currentProduct) {
            reset({
                name: currentProduct.name,
                description: currentProduct.description || "",
                barcode: currentProduct.barcode || "",
                price: Number(currentProduct.price) || 0,
                cost: Number(currentProduct.cost) || 0,
                quantity: Number(currentProduct.quantity) || 0,
                minStock: currentProduct.minStock ? Number(currentProduct.minStock) : undefined,
                maxStock: currentProduct.maxStock ? Number(currentProduct.maxStock) : undefined,
                unit: currentProduct.unit || "",
                weight: currentProduct.weight,
                dimensions: currentProduct.dimensions || "",
                type: "PRODUCT",
                companyId: String(user?.company?.id),
                categoryId: currentProduct.categoryId || (currentProduct as any).category_id || (typeof currentProduct.category === 'string' && currentProduct.category.length > 20 ? currentProduct.category : ""),
                taxId: currentProduct.taxId || currentProduct.tax?.id || "",
                // daysToExpiry: currentProduct.daysToExpiry || undefined,
                expiryDate: currentProduct.expiryDate || "",
            });
        }
    }, [isEdit, currentProduct, reset, user?.company?.id]);

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

            if (isEdit && currentProduct) {
                await updateItemMutate({
                    id: currentProduct.id,
                    data: rest,
                });
            } else {
                await addItemMutate({
                    ...cleanedData,
                    ...(user?.role === "OWNER" && currentStore?.id && { storeId: currentStore?.id }),
                });
            }
            handleCancel();
        } catch (error: any) {
            if (error?.response) {
                ErrorMessage(
                    error?.response?.data?.message ||
                    `Ocorreu um erro ao ${isEdit ? "atualizar" : "adicionar"} o item`,
                );
            } else {
                ErrorMessage(`Ocorreu um erro desconhecido ao ${isEdit ? "atualizar" : "adicionar"}. Tente novamente`);
            }
        }
    }

    const handleCancel = () => {
        reset();
        closeModal(isEdit ? "edit-product" : "add-product");
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
                                    placeholder={currentProduct?.category}
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
                                min={1}
                                type="number"
                                placeholder="14"
                                label="Dias até Expirar (opcional)"
                                {...register("daysToExpiry")}
                                error={errors?.daysToExpiry?.message}
                            />
                        </div>
                    </FeatureGate>

                    <Textarea
                        label="Descrição (opcional)"
                        {...register("description")}
                        className="mt-1 min-h-[100px]"
                        placeholder="Escreva detalhes do item..."
                        error={errors?.description?.message}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-5">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <ButtonSubmit className="w-max" isLoading={isAdding || isUpdating || isSubmitting}>
                        {isEdit ? "Atualizar" : "Salvar"}
                    </ButtonSubmit>
                </div>
            </div>
        </form>
    );
}
