"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    GlobalModal,
    Input,
    Button,
    Textarea,
} from "@/components";
import { useModal, currentStoreStore } from "@/stores";
import { cashSessionsService } from "@/services/cash-sessions-service";
import { SucessMessage } from "@/utils/messages";
import { CashSession } from "@/types/cash-session";

export const MODAL_POS_REGISTER_EXPENSE_ID = "pos-register-expense-modal";

const expenseSchema = z.object({
    description: z.string().min(1, "A descrição é obrigatória"),
    amount: z.coerce.number().positive("O valor deve ser maior que zero"),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface PosRegisterExpenseModalProps {
    currentSession?: CashSession;
}

export function PosRegisterExpenseModal({ currentSession }: PosRegisterExpenseModalProps) {
    const { closeModal } = useModal();
    const { currentStore } = currentStoreStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
    });

    const onSubmit = async (data: ExpenseFormData) => {
        if (!currentStore?.id || !currentSession?.id) {
            return;
        }

        try {
            setIsLoading(true);
            await cashSessionsService.registerExpense({
                description: data.description,
                amount: data.amount,
                cashSessionId: currentSession.id,
            });
            SucessMessage("Despesa registada com sucesso!");
            closeModal(MODAL_POS_REGISTER_EXPENSE_ID);
            reset();
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GlobalModal
            id={MODAL_POS_REGISTER_EXPENSE_ID}
            title="Registar Despesa"
            description="Informe a descrição e o valor da despesa realizada."
            className="!w-max"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Textarea
                    label="Descrição"
                    placeholder="Ex: Material de escritório, Limpeza, etc."
                    error={errors.description?.message}
                    {...register("description")}
                />

                <Input
                    label="Valor"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    startIcon="CircleDollarSign"
                    error={errors.amount?.message}
                    {...register("amount")}
                />

                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => closeModal(MODAL_POS_REGISTER_EXPENSE_ID)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" loading={isLoading}>
                        Registar Despesa
                    </Button>
                </div>
            </form>
        </GlobalModal>
    );
}
