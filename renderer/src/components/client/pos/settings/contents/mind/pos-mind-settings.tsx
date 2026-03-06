"use client";

import { useMindPricingConfig } from "@/hooks";
import { Switch, Label, Button } from "@/components";
import { Sparkles, Activity, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import api from "@/services/api";
import axios from "axios";

export function PosMindSettings() {
    const {
        isMindPricingEnabled, setMindPricingEnabled, triggerPricingRecalculation,
        isRecommendationsEnabled, setRecommendationsEnabled
    } = useMindPricingConfig();
    const [isRecalculating, setIsRecalculating] = useState(false);

    const handlePricingToggle = (checked: boolean) => {
        setMindPricingEnabled(checked);
        if (checked) {
            toast.success("MIND Ativada", {
                description: "O Motor de Inteligência Artificial foi ativado com sucesso.",
            });
        } else {
            toast.warning("MIND Desativada", {
                description: "As funções de IA foram suspensas. Preços voltarão ao normal.",
            });
        }
    };

    const handleRecommendationsToggle = async (checked: boolean) => {
        setRecommendationsEnabled(checked);
        if (checked) {
            toast.info("A iniciar treino...", {
                description: "A MIND está a analisar o histórico de faturas online.",
            });
            try {
                // Fetch invoices from the authenticated Next.js API instance
                const res = await api.get('/invoice/invoice-receipt?limit=1000');
                const invoices = res.data?.data || [];
                // Send them to Python microservice
                await axios.post("http://localhost:5001/api/ai/train", { invoices });
                toast.success("MIND Treinada", {
                    description: "O Motor de Recomendação está pronto a usar.",
                });
            } catch (err) {
                console.error("Failed to train recommendation model:", err);
                toast.error("Erro no Treino", {
                    description: "Falha ao obter faturas online ou servidor AI indisponível.",
                });
            }
        }
    };

    const handleForceRecalculation = async () => {
        setIsRecalculating(true);
        toast.info("A iniciar recalculo...", {
            description: "A IA está analisar o stock e a precificação dinâmica."
        });

        try {
            await triggerPricingRecalculation();
            // Provide a small delay for UI effect
            setTimeout(() => {
                setIsRecalculating(false);
                toast.success("Recalculo Concluído", {
                    description: "Os preços foram atualizados na cache local."
                });
            }, 1500);
        } catch (e) {
            setIsRecalculating(false);
            toast.error("Erro no Recalculo", {
                description: "Não foi possível contactar o microserviço MIND."
            });
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    MIND Inteligência Artificial
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Configure os motores locais de recomendação, prevenção e descontos dinâmicos do seu POS.
                </p>
            </div>

            <div className="border rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base font-medium flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Precificação Dinâmica Automática
                        </Label>
                        <p className="text-sm text-muted-foreground max-w-[85%]">
                            Ative para permitir que a MIND reduza preços autonomamente em produtos prestes a expirar,
                            excedentes de stock, ou horas próximas do fecho.
                        </p>
                    </div>
                    <Switch
                        checked={isMindPricingEnabled}
                        onCheckedChange={handlePricingToggle}
                    />
                </div>

                {isMindPricingEnabled && (
                    <div className="pt-4 border-t mt-4">
                        <div className="bg-primary/5 p-4 rounded-md border border-primary/20 flex gap-3">
                            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div className="text-sm space-y-1">
                                <p className="font-medium text-primary">Como a MIND decide os descontos?</p>
                                <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                                    <li><strong>Validade:</strong> Produtos expirando em 2 dias recebem o desconto máximo imediato.</li>
                                    <li><strong>Horário:</strong> Descontos progressivos nas últimas 2 horas de operação da loja.</li>
                                    <li><strong>Stock Excessivo:</strong> Lotes com mais de 50 unidades começam a escoar ativamente.</li>
                                    <li><strong>Índice da Loja:</strong> O ticket médio (Poder de Compra) afeta o teto máximo global do desconto.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleForceRecalculation}
                                disabled={isRecalculating}
                            >
                                <Activity className={`w-4 h-4 mr-2 ${isRecalculating ? 'animate-spin' : ''}`} />
                                Forçar Recalculo de Preços
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="border rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base font-medium flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Motor de Recomendação Inteligente
                        </Label>
                        <p className="text-sm text-muted-foreground max-w-[85%]">
                            Ative para exibir sugestões dinâmicas de venda-cruzada e "upsell" (max 2 produtos) para o operador de caixa baseadas no histórico real de faturas faturadas.
                        </p>
                    </div>
                    <Switch
                        checked={isRecommendationsEnabled}
                        onCheckedChange={handleRecommendationsToggle}
                    />
                </div>
            </div>

            <div className="border rounded-lg p-5 space-y-4 opacity-70">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base font-medium flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Prevenção de Fraudes (Camera)
                        </Label>
                        <p className="text-sm text-muted-foreground max-w-[85%]">
                            Ative a vigilância silenciosa sobre Cancelamentos e Aberturas de Gaveta através do YOLOv8.
                        </p>
                    </div>
                    <Switch
                        checked={true}
                        disabled={true}
                    />
                </div>
                <p className="text-xs text-muted-foreground">Obrigatório pelo sistema central. Não pode ser desativado pelo Operador local.</p>
            </div>
        </div>
    );
}
