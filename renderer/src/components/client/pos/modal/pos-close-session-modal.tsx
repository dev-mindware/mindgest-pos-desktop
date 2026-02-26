"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    GlobalModal,
    Input,
    Button,
    Textarea,
    Icon,
} from "@/components";
import { useModal } from "@/stores";
import { cashSessionsService } from "@/services/cash-sessions-service";
import { SucessMessage, ErrorMessage } from "@/utils/messages";
import { CashSession } from "@/types/cash-session";
import { formatCurrency } from "@/utils";

export const MODAL_POS_CLOSE_SESSION_ID = "pos-close-session-modal";

const closeSessionSchema = z.object({
    closingCash: z.coerce.number().min(0, "O valor de fecho deve ser pelo menos 0"),
    totalSales: z.coerce.number(),
    notes: z.string().optional(),
});

type CloseSessionFormData = z.infer<typeof closeSessionSchema>;

interface PosCloseSessionModalProps {
    currentSession?: CashSession;
}

export function PosCloseSessionModal({ currentSession }: PosCloseSessionModalProps) {
    const { closeModal } = useModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CloseSessionFormData>({
        resolver: zodResolver(closeSessionSchema),
        defaultValues: {
            totalSales: currentSession?.totalSales || 0,
            closingCash: 0,
            notes: "",
        }
    });

    useEffect(() => {
        if (currentSession) {
            setValue("totalSales", currentSession.totalSales || 0);
        }
    }, [currentSession, setValue]);

    const onSubmit = async (data: CloseSessionFormData) => {
        if (!currentSession?.id) {
            ErrorMessage("Sessão não encontrada.");
            return;
        }

        try {
            setIsLoading(true);
            await cashSessionsService.closeSession(currentSession.id, {
                closingCash: data.closingCash,
                totalSales: data.totalSales,
                notes: data.notes || "",
            });
            SucessMessage("Sessão fechada com sucesso!");
            closeModal(MODAL_POS_CLOSE_SESSION_ID);
            reset();
            // Optional: refresh page or state to reflect closure
            window.location.reload();
        } catch (err: any) {
            console.error(err);
            ErrorMessage("Erro ao fechar sessão.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GlobalModal
            id={MODAL_POS_CLOSE_SESSION_ID}
            title="Fechar Sessão de Caixa"
            description="Confirme os valores finais e feche a sessão atual."
            className="!w-max"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 min-w-[350px]">
                <div className="p-4 bg-muted/30 rounded-lg border border-primary/5 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total de Vendas</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(currentSession?.totalSales || 0)}</p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Icon name="TrendingUp" className="h-5 w-5 text-primary" />
                    </div>
                </div>

                <Input
                    label="Valor em Caixa (Fecho)"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    startIcon="Banknote"
                    error={errors.closingCash?.message}
                    {...register("closingCash")}
                />

                <Textarea
                    label="Notas / Observações"
                    placeholder="Alguma ocorrência durante o turno?"
                    error={errors.notes?.message}
                    {...register("notes")}
                />

                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => closeModal(MODAL_POS_CLOSE_SESSION_ID)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" loading={isLoading} variant="destructive">
                        Fechar Sessão
                    </Button>
                </div>
            </form>
        </GlobalModal>
    );
}
