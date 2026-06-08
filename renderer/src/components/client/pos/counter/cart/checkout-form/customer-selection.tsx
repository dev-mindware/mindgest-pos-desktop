// c:\Users\GTIMINDCOM\Documents\GitHub\mindgest-pos-desktop\renderer\src\components\client\pos\counter\cart\checkout-form\customer-selection.tsx
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
  newCustomerNif?: string;
  onNifChange?: (taxNumber: string) => void;
  isProforma?: boolean;
}

export function CustomerSelection({
  isExpanded,
  onToggleExpand,
  selectedClient,
  onClientChange,
  newCustomerPhone,
  onPhoneChange,
  newCustomerNif,
  onNifChange,
  isProforma = false,
}: CustomerSelectionProps) {
  return (
    <div className="space-y-3 min-w-0">
      <button
        onClick={onToggleExpand}
        className="flex items-center justify-between cursor-pointer w-full py-2 group hover:text-primary transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Cliente{!isProforma ? " (Opcional)" : ""}</span>
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

      {
        isExpanded && (
          /* Adicionado w-full e min-w-0 para conter o avanço do flex */
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 w-full min-w-0 overflow-hidden">
            <div className="space-y-2 min-w-0 w-full">
              <div className="min-w-0 w-full">
                <AsyncCreatableSelectField
                  endpoint="/clients"
                  label=""
                  placeholder="Buscar Cliente..."
                  value={selectedClient}
                  onChange={onClientChange}
                  displayFields={["name", "phone"]}
                  minChars={2}
                  formatCreateLabel={(val) => `➕ Criar "${val}"`}
                />
              </div>
            </div>

            {/* Se não houver cliente selecionado ou for novo, mostra campos de telefone + taxNumber */}
            {(!selectedClient || selectedClient.__isNew__) && (
              /* Garantido que em telas muito pequenas (abaixo de sm) não quebre o layout lateral */
              <div className="flex lg:flex-col flex-row sm:gap-2 gap-3 pt-2 border-t border-dashed w-full min-w-0">
                <div className="flex-1 min-w-0 w-full">
                  <Input
                    startIcon="Phone"
                    type="text"
                    inputMode="numeric"
                    data-layout="numeric"
                    placeholder="Telefone"
                    value={newCustomerPhone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    className="bg-muted/30 truncate w-full"
                  />
                </div>

                {/* Alterado de sm:w-36 fixo para sm:basis-36 para responder melhor ao flexbox */}
                <div className="w-full min-w-0 shrink-0">
                  <Input
                    startIcon="Hash"
                    type="text"
                    inputMode="numeric"
                    placeholder="NIF"
                    value={newCustomerNif}
                    onChange={(e) => onNifChange?.(e.target.value)}
                    className="bg-muted/30 w-full"
                  />
                </div>
              </div>
            )}
          </div>
        )
      }
    </div >
  );
}
