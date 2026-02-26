import { Icon, InputCurrency } from "@/components";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";
import { PaymentMethod } from "@/hooks";

interface PaymentMethodsProps {
    paymentMethod: PaymentMethod;
    onMethodChange: (method: PaymentMethod) => void;
    cashGiven: number | "";
    onCashChange: (val: number) => void;
    onQuickCash: (amount: number) => void;
    change: number;
}

export function PaymentMethods({
    paymentMethod,
    onMethodChange,
    cashGiven,
    onCashChange,
    onQuickCash,
    change,
}: PaymentMethodsProps) {
    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 flex p-1 gap-2 bg-muted/50 rounded-md">
                    {(["Credit Card", "Cash"] as PaymentMethod[]).map((method) => (
                        <button
                            key={method}
                            onClick={() => onMethodChange(method)}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-2 py-2 rounded-md text-xs font-medium transition-all",
                                paymentMethod === method
                                    ? "bg-primary/15 shadow text-primary"
                                    : "text-muted-foreground hover:bg-accent",
                            )}
                        >
                            {method === "Credit Card" ? (
                                <Icon name="CreditCard" size={16} />
                            ) : (
                                <Icon name="Banknote" size={16} />
                            )}
                            {method === "Cash" ? "Dinheiro" : "Multicaixa"}
                        </button>
                    ))}
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="h-full aspect-square rounded-md bg-muted flex items-center justify-center cursor-help hover:bg-muted/80 transition-colors">
                            <Icon
                                name="Info"
                                size={16}
                                className="text-muted-foreground"
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            Contacte os desenvolvedores para adicionar diferentes métodos de
                            pagamento.
                        </p>
                    </TooltipContent>
                </Tooltip>
            </div>

            {paymentMethod === "Cash" && (
                <div className="space-y-3 bg-muted/30 p-3 rounded-xl border border-dashed mb-3">
                    <div className="grid grid-cols-4 gap-2">
                        {[200, 500, 1000, 5000].map((amt) => (
                            <Button
                                key={amt}
                                variant="outline"
                                size="sm"
                                className="text-xs h-8 px-0"
                                onClick={() => onQuickCash(amt)}
                            >
                                {amt}kz
                            </Button>
                        ))}
                    </div>
                    <div className="space-y-1">
                        <InputCurrency
                            label="Valor Entregue"
                            placeholder="0,00"
                            value={cashGiven}
                            onValueChange={(value) => onCashChange(value)}
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                        />
                    </div>
                    <div
                        className={cn(
                            "flex justify-between bg-muted text-sm font-bold p-2 rounded-md",
                            change >= 0 ? "text-green-700" : "text-red-700",
                        )}
                    >
                        <span>Troco</span>
                        <span>{formatCurrency(change)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
