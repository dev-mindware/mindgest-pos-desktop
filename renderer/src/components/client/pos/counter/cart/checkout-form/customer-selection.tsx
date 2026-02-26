import { Icon } from "@/components";
import { Input } from "@/components/ui/input";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";

interface CustomerSelectionProps {
    isExpanded: boolean;
    onToggleExpand: () => void;
    selectedClient: any;
    onClientChange: (client: any) => void;
    newCustomerPhone: string;
    onPhoneChange: (phone: string) => void;
}

export function CustomerSelection({
    isExpanded,
    onToggleExpand,
    selectedClient,
    onClientChange,
    newCustomerPhone,
    onPhoneChange,
}: CustomerSelectionProps) {
    return (
        <div className="mb-6 space-y-3">
            <button
                onClick={onToggleExpand}
                className="flex items-center justify-between w-full py-2 group hover:text-primary transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">Cliente (Opcional)</span>
                </div>
                {isExpanded ? (
                    <Icon
                        name="ChevronDown"
                        size={16}
                        className="text-muted-foreground group-hover:text-primary"
                    />
                ) : (
                    <Icon
                        name="ChevronRight"
                        size={16}
                        className="text-muted-foreground group-hover:text-primary"
                    />
                )}
            </button>

            {isExpanded && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Buscar Cliente
                        </label>
                        <AsyncCreatableSelectField
                            endpoint="/clients"
                            label=""
                            placeholder="Procurar cliente..."
                            value={selectedClient}
                            onChange={onClientChange}
                            displayFields={["name", "phone"]}
                            minChars={2}
                            formatCreateLabel={(val) => `➕ Criar "${val}"`}
                        />
                    </div>

                    {/* If no selected customer or it's a new one, show phone field */}
                    {(!selectedClient || selectedClient.__isNew__) && (
                        <div className="space-y-2 pt-2 border-t border-dashed">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Telefone do Cliente (Novo)
                            </label>
                            <Input
                                startIcon="Phone"
                                type="text"
                                inputMode="numeric"
                                data-layout="numeric"
                                placeholder="Digite o número de telefone..."
                                value={newCustomerPhone}
                                onChange={(e) => onPhoneChange(e.target.value)}
                                className="bg-muted/30"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
