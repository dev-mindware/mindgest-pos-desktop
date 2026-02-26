import { Button } from "@/components/ui/button";
import { DynamicDrawer } from "@/components/common/dynamic-drawer";
import { InvoiceTemplate } from "@/components/common/dynamic-drawer/templates/invoice-template";
import { InvoiceResponse, DocumentType } from "@/types";
import { PosSalesFormData } from "@/schemas";

interface PosInvoicePreviewDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: PosSalesFormData | null;
    cartItems: any[];
    onConfirm: () => void;
    isLoading: boolean;
    type: "invoice" | "proforma";
}

export function InvoicePreviewDrawer({
    open,
    onOpenChange,
    data,
    cartItems,
    onConfirm,
    isLoading,
    type = "invoice",
}: PosInvoicePreviewDrawerProps) {
    if (!data) return null;

    // Map POS data to InvoiceResponse structure for the template
    const mockInvoiceData: any = {
        id: "preview",
        number: "PRÉ-VISUALIZAÇÃO",
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(), // Adjust if needed
        status: "DRAFT",
        client: data.client || {
            name: "Consumidor Final",
            phone: "N/A",
            email: "",
            nif: "999999999",
            address: "Loja"
        },
        items: cartItems.map((item) => ({
            id: item.id,
            item: { name: item.name },
            quantity: item.qty,
            price: item.price,
            total: item.price * item.qty,
        })),
        subtotal: data.subtotal || 0,
        discountAmount: data.discountAmount || 0,
        taxAmount: data.taxAmount || 0,
        total: data.total || 0,
        notes: "Gerado via POS",
    };

    return (
        <DynamicDrawer
            open={open}
            onOpenChange={onOpenChange}
            title={`Confirmar ${type === 'invoice' ? 'Fatura' : 'Proforma'}`}
            description="Verifique os dados antes de finalizar."
            className="max-w-4xl"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto px-1">
                    <InvoiceTemplate
                        type={type === 'invoice' ? 'invoice-receipt' : 'proforma'}
                        data={mockInvoiceData}
                        hideDueDate={true}
                        hideActions={true}
                        changeValue={data.change}
                    />
                </div>

                <div className="pt-6 mt-4 border-t flex gap-3 justify-end bg-background sticky bottom-0 z-10">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button onClick={onConfirm} disabled={isLoading} className="min-w-[150px]">
                        {isLoading ? "Processando..." : `Confirmar e Emitir`}
                    </Button>
                </div>
            </div>
        </DynamicDrawer>
    );
}
