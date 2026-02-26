"use client";
import { Card, CardContent, Icon, DynamicMetricCard } from "@/components";
import { currentStoreStore, useModal } from "@/stores";
import { cn } from "@/lib/utils";
import {
    PosOpeningCashierModal,
    PosRequestOpeningModal,
    PosRegisterExpenseModal,
    PosCloseSessionModal
} from "../../modal";
import { PosOpeningModal } from "@/components/client/management/pos/modal/pos-opening-modal";
import { useAuth } from "@/hooks/auth/use-auth";
import { formatCurrency, formatDateTime } from "@/utils";
import { CashSession } from "@/types/cash-session";
import { useQueryClient } from "@tanstack/react-query";

interface PosGeneralSettingsProps {
    currentSession?: CashSession;
}

export function PosGeneralSettings({ currentSession }: PosGeneralSettingsProps) {
    const { openModal } = useModal();
    const { user } = useAuth();
    const { currentStore } = currentStoreStore();
    const queryClient = useQueryClient();
    const isOpen = !!currentSession?.isOpen;
    const isManagement = user?.role === "ADMIN" || user?.role === "OWNER" || user?.role === "MANAGER";

    const actionCards = [
        {
            title: "Solicitar",
            subtitle: "Abertura de Caixa",
            description: "Peça autorização para iniciar",
            icon: "ClipboardList",
            variant: "action" as const,
            onClick: () => openModal("pos-request-opening-modal"),
        },
        {
            title: isOpen ? "Sessão" : "Abrir",
            subtitle: isOpen ? "Caixa Aberto" : "Iniciar Caixa",
            description: isOpen ? "Turno em andamento" : "Clique para abrir o caixa",
            icon: isOpen ? "Check" : "Play",
            variant: isOpen ? ("default" as const) : ("action" as const),
            onClick: !isOpen
                ? () => openModal(isManagement ? "opening-cashier" : "opening-cashier-session")
                : undefined,
        },
        {
            title: "Fechar",
            subtitle: "Encerrar Sessão",
            description: "Finalize as vendas do dia",
            icon: "Power",
            variant: isOpen ? ("action" as const) : ("default" as const),
            colors: "destructive" as const,
            onClick: isOpen ? () => openModal("pos-close-session-modal") : undefined,
            disabled: !isOpen,
        },
        {
            title: "Registar",
            subtitle: "Nova Despesa",
            description: "Saída manual de valores",
            icon: "Minus",
            variant: isOpen ? ("action" as const) : ("default" as const),
            colors: "destructive" as const,
            onClick: isOpen ? () => openModal("pos-register-expense-modal") : undefined,
            disabled: !isOpen,
        },
    ];

    const sessionMetrics = currentSession ? [
        {
            label: "Status Atual",
            value: (
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "flex h-2 w-2 rounded-full",
                        isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
                    )} />
                    <span className="font-outfit font-semibold">{isOpen ? "Em Operação" : "Finalizada"}</span>
                </div>
            )
        },
        {
            label: "Tempo Decorrido",
            value: (
                <div className="flex items-center gap-2">
                    <Icon name="Timer" className="h-3.5 w-3.5 text-primary" />
                    <p className="font-mono font-bold text-primary">{currentSession.duration || "00:00:00"}</p>
                </div>
            )
        },
        {
            label: "Abertura",
            value: formatDateTime(currentSession.openedAt)
        },
        {
            label: "Vendas (Total)",
            className: "text-right md:text-left",
            value: (
                <p className="text-xl font-outfit font-black text-primary leading-tight">
                    {formatCurrency(currentSession.totalSales || 0)}
                </p>
            )
        },
        {
            label: "Fundo de Caixa",
            value: <span className="text-lg">{formatCurrency(currentSession.openingCash)}</span>
        },
        {
            label: "Tipo Pagamento",
            value: currentSession.fundType || "-"
        },
        {
            label: "Responsável",
            value: <span className="truncate block" title={currentSession.authorizedById}>{currentSession.authorizedById || "-"}</span>
        }
    ] : [];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {actionCards.map((card, index) => (
                    <DynamicMetricCard
                        key={index}
                        {...card}
                        icon={card.icon as any}
                        className={cn(
                            "h-full",
                            (card as any).disabled && "opacity-50 grayscale pointer-events-none"
                        )}
                    />
                ))}
            </div>

            {currentSession && (
                <Card className="border-primary/10 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="bg-muted/30 px-6 py-4 border-b border-primary/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-full",
                                isOpen ? "bg-green-500/10" : "bg-red-500/10"
                            )}>
                                <Icon
                                    name={isOpen ? "Store" : "Lock"}
                                    className={cn("h-5 w-5", isOpen ? "text-green-600" : "text-red-600")}
                                />
                            </div>
                            <div>
                                <h3 className="font-outfit font-bold text-lg leading-none">Detalhes da Sessão</h3>
                                <p className="text-xs text-muted-foreground mt-1 lowercase">loja: {currentSession.storeId || "principal"}</p>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                            {sessionMetrics.map((metric, index) => (
                                <MetricItem key={index} {...metric} />
                            ))}

                            <div className="col-span-2 md:col-span-4 mt-2 p-3 bg-muted/50 rounded-lg border border-primary/5">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Notas da Sessão</p>
                                <p className="text-sm italic">{currentSession.notes || "Nenhuma observação registada para esta sessão."}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <PosOpeningModal />
            <PosOpeningCashierModal onSuccess={() => {
                queryClient.invalidateQueries({
                    queryKey: ["current-cash-session", currentStore?.id]
                });
            }} />
            <PosRequestOpeningModal />
            <PosRegisterExpenseModal currentSession={currentSession} />
            <PosCloseSessionModal currentSession={currentSession} />
        </div>
    );
}

function MetricItem({ label, value, className }: { label: string, value: React.ReactNode, className?: string }) {
    return (
        <div className={cn("space-y-1", className)}>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
            <div className="font-semibold">{value}</div>
        </div>
    );
}
