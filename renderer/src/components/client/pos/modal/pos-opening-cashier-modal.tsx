"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    GlobalModal,
    Input,
    Button,
    RHFSelect,
    Icon,
    TimeField,
    DateInput,
    Label,
} from "@/components";
import { useModal, currentStoreStore } from "@/stores";
import { PosOpeningCashierFormData, posOpeningCashierSchema } from "@/schemas/pos-opening";
import { cashSessionsService } from "@/services/cash-sessions-service";
import { SucessMessage, ErrorMessage } from "@/utils/messages";
import { useAuth } from "@/hooks/auth";
import { ManagerAuthModal, MODAL_MANAGER_AUTH_ID } from "../..";
import { formatCurrency, parseCurrency } from "@/utils";
import { parseTime } from "@internationalized/date";

interface PosOpeningCashierModalProps {
    onSuccess?: () => void;
}

export function PosOpeningCashierModal({ onSuccess }: PosOpeningCashierModalProps) {
    const { closeModal, openModal } = useModal();
    const { user } = useAuth();
    const { currentStore } = currentStoreStore();
    const [pendingData, setPendingData] = useState<Partial<PosOpeningCashierFormData> | null>(null);

    const {
        register,
        control,
        reset,
        trigger,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<PosOpeningCashierFormData>({
        resolver: zodResolver(posOpeningCashierSchema),
        defaultValues: {
            initialCapital: "",
            workTime: "08:00",
            storeId: currentStore?.id || "",
            fundType: "Coin",
            managerBarcode: "",
            cashierIds: user?.id ? [user.id] : [],
        },
    });

    // Update form when user or store changes
    useEffect(() => {
        if (user?.id || currentStore?.id) {
            reset({
                initialCapital: getValues("initialCapital") || "",
                workTime: getValues("workTime") || "08:00",
                storeId: currentStore?.id || "",
                fundType: getValues("fundType") || "Coin",
                managerBarcode: "",
                cashierIds: user?.id ? [user.id] : [],
            });
        }
    }, [user, currentStore, reset]);

    const handleClose = () => {
        reset();
        setPendingData(null);
        closeModal("opening-cashier-session");
    };

    const handleNextStep = async () => {
        const isValid = await trigger(["initialCapital", "workTime", "storeId", "fundType", "cashierIds"]);

        if (isValid) {
            const data = getValues();
            setPendingData(data);
            openModal(MODAL_MANAGER_AUTH_ID);
        } else {
            console.log("Validation errors:", errors);
        }
    };

    const handleAuthenticated = async (barcode: string) => {
        if (!pendingData) return;

        try {
            const payload = {
                ...pendingData,
                storeId: currentStore?.id,
                managerBarcode: barcode,
                cashierIds: user?.id ? [user.id] : []
            };

            console.log("Enviando payload para abertura de caixa:", payload);

            await cashSessionsService.openSession(payload);
            SucessMessage("Sessão de caixa aberta com sucesso!");
            if (onSuccess) onSuccess();
            handleClose();
        } catch (error: any) {
            console.error("Erro ao abrir sessão de caixa:", error);
            const message = error?.response?.data?.message || "Erro ao abrir sessão de caixa. Verifique suas permissões (403).";
            ErrorMessage(message);
            throw error;
        }
    };

    return (
        <>
            <GlobalModal
                id="opening-cashier-session"
                title="Abertura de Caixa"
                description="Confira os dados da loja e defina seu capital inicial."
                canClose
                className="!w-max"
            >
                <div className="space-y-6 pt-4">
                    {/* Store Information Banner */}
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Icon name="Store" className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1 overflow-hidden">
                            <p className="text-sm font-bold text-primary uppercase tracking-wider">Loja de Operação</p>
                            <h4 className="font-outfit font-black text-lg leading-tight uppercase truncate">
                                {currentStore?.name || "Loja Principal"}
                            </h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                                <Icon name="MapPin" className="w-3 h-3" />
                                {currentStore?.address || "Endereço não configurado"}
                            </p>
                        </div>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Controller
                                    name="initialCapital"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            label="Capital Inicial"
                                            placeholder="0,00 Kz"
                                            startIcon="CircleDollarSign"
                                            value={formatCurrency(value || 0)}
                                            onChange={(e) => onChange(parseCurrency(e.target.value).toString())}
                                            error={errors.initialCapital?.message}
                                        />
                                    )}
                                />

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-foreground">Tempo de Expediente</Label>
                                    <Controller
                                        name="workTime"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <TimeField
                                                id="workTime"
                                                aria-label="Tempo de expediente"
                                                hourCycle={24}
                                                className="w-full"
                                                value={value ? parseTime(value as string) : parseTime("08:00")}
                                                onChange={(val: any) => {
                                                    if (val) {
                                                        const timeStr = val.toString();
                                                        // Ensure format is HH:MM
                                                        const formatted = timeStr.split(':').slice(0, 2).join(':');
                                                        onChange(formatted);
                                                    } else {
                                                        onChange("");
                                                    }
                                                }}
                                            >
                                                <div className="relative">
                                                    <DateInput id="workTime-input" className="bg-background" />
                                                    <Icon name="Clock" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </TimeField>
                                        )}
                                    />
                                    {errors.workTime && (
                                        <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mt-1">
                                            {errors.workTime.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <RHFSelect
                                    name="fundType"
                                    control={control}
                                    label="Tipo de Fundo"
                                    placeholder="Selecione"
                                    options={[
                                        { label: "Moeda", value: "Coin" },
                                        { label: "Nota", value: "Note" },
                                    ]}
                                />

                                <div className="flex flex-col justify-end pb-1.5">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Operador</p>
                                    <p className="text-sm font-medium truncate">{user?.name || "Usuário Logado"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-muted-foreground/5">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={handleNextStep}
                                loading={isSubmitting}
                                className="bg-primary hover:bg-primary/90 text-white px-8"
                            >
                                Próximo Passo
                            </Button>
                        </div>
                    </form>
                </div>
            </GlobalModal>

            <ManagerAuthModal onAuthenticated={handleAuthenticated} />
        </>
    );
}
