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
    RequestError,
} from "@/components";
import { useModal, currentStoreStore } from "@/stores";
import { cashSessionsService } from "@/services/cash-sessions-service";
import { SucessMessage } from "@/utils/messages";

export const MODAL_POS_REQUEST_OPENING_ID = "pos-request-opening-modal";

const requestSchema = z.object({
    message: z.string().min(1, "A mensagem é obrigatória"),
});

type RequestFormData = z.infer<typeof requestSchema>;

export function PosRequestOpeningModal() {
    const { closeModal } = useModal();
    const { currentStore } = currentStoreStore();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RequestFormData>({
        resolver: zodResolver(requestSchema),
    });

    const onSubmit = async (data: RequestFormData) => {
        if (!currentStore?.id) {
            setError("Loja não identificada. Contacte o suporte.");
            return;
        }

        try {
            setError(null);
            await cashSessionsService.requestOpening({
                storeId: currentStore.id,
                message: data.message,
            });
            SucessMessage("Solicitação enviada com sucesso!");
            closeModal(MODAL_POS_REQUEST_OPENING_ID);
            reset();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Erro ao enviar solicitação.");
        }
    };

    return (
        <GlobalModal
            id={MODAL_POS_REQUEST_OPENING_ID}
            title="Solicitar Abertura de Caixa"
            description="Envie uma mensagem ao gerente solicitando a abertura."
            className="!w-max"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Textarea
                    label="Mensagem"
                    placeholder="Ex: Preciso abrir o caixa para o turno da tarde."
                    error={errors.message?.message}
                    {...register("message")}
                />

                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => closeModal(MODAL_POS_REQUEST_OPENING_ID)}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" loading={isSubmitting}>
                        Enviar Solicitação
                    </Button>
                </div>
            </form>
        </GlobalModal>
    );
}
