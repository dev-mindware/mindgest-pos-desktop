"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/utils/messages";
import { useModal, currentStockStore } from "@/stores";
import { StockReserveFormData, stockReserveSchema } from "@/schemas/stock-schema";
import { useReserveStock } from "@/hooks/stock";
import { Button, Input, GlobalModal, ButtonSubmit, Textarea } from "@/components";

export function ReserveStockModal() {
    const { closeModal, open } = useModal();
    const isOpen = open["reserve-stock"];
    const { currentStock } = currentStockStore();
    const { mutateAsync: reserveStock, isPending } = useReserveStock();

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<StockReserveFormData>({
        resolver: zodResolver(stockReserveSchema),
        mode: "onChange",
    });

    async function onSubmit(data: StockReserveFormData) {
        if (!currentStock) return;

        // Validate amount doesn't exceed available
        if (data.amount > currentStock.available) {
            ErrorMessage(`A quantidade não pode ser maior que ${currentStock.available} (disponível)`);
            return;
        }

        try {
            await reserveStock({ id: currentStock.id, data });
            handleCancel();
        } catch (error: any) {
            ErrorMessage(
                error?.response?.data?.message ||
                "Ocorreu um erro ao reservar o stock."
            );
        }
    }

    const handleCancel = () => {
        reset();
        closeModal("reserve-stock");
    };

    if (!currentStock || !isOpen) return null;

    return (
        <GlobalModal
            canClose
            id="reserve-stock"
            title="Reservar Stock"
            className="!max-w-md"
        >
            <div className="mb-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Produto:</span>{" "}
                    {currentStock.item?.name || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Disponível:</span>{" "}
                    <span className="text-green-600 font-semibold">{currentStock.available}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Já Reservado:</span>{" "}
                    {currentStock.reserved}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    type="number"
                    label="Quantidade a Reservar"
                    placeholder="Ex: 5"
                    {...register("amount", { valueAsNumber: true })}
                    error={errors.amount?.message}
                    max={currentStock.available}
                />
                <p className="text-xs text-muted-foreground">Máximo: {currentStock.available}</p>

                <Textarea
                    label="Motivo"
                    placeholder="Ex: Reserva para pedido #12345"
                    {...register("reason")}
                    error={errors.reason?.message}
                    rows={3}
                />

                <div className="flex justify-end gap-4 mt-5">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <ButtonSubmit
                        className="w-max"
                        isLoading={isSubmitting || isPending}
                    >
                        Reservar Stock
                    </ButtonSubmit>
                </div>
            </form>
        </GlobalModal>
    );
}
