"use client";

import { Button } from "@/components";
import { InvoicePreviewDrawer as PosInvoicePreviewDrawer } from "../../modals/invoice-preview-drawer";
import { ErrorMessage } from "@/utils";
import { CartItem } from "@/hooks";
import { PaymentSummary } from "./payment-summary";
import { PaymentMethods } from "./payment-methods";
import { DocumentSuccessModal } from "@/components/client/documents/modals/document-success-modal";

interface CartCheckoutFormProps {
    cartItems: CartItem[];
    onSuccess?: () => void;
    type?: "invoice" | "proforma";
    cashSessionId: string;
    checkout: any;
}

export function CartCheckoutForm({
    cartItems,
    onSuccess,
    type = "invoice",
    cashSessionId,
    checkout,
}: CartCheckoutFormProps) {
    const {
        form: { handleSubmit },
        paymentMethod,
        setPaymentMethod,
        cashGiven,
        setCashGiven,
        change,
        totals,
        handlePreview,
        handleCancel,
        handleFinalSubmit,
        isPreviewOpen,
        setIsPreviewOpen,
        pendingPayload,
        isPending,
    } = checkout;

    return (
        <>
            <div className="p-2 h-full flex flex-col justify-between border border-dashed rounded-test-md bg-muted/30">
                <PaymentSummary
                    subtotal={totals.subtotal}
                    taxAmount={totals.taxAmount}
                    discountAmount={totals.discountAmount}
                    total={totals.total}
                    change={change}
                    paymentMethod={paymentMethod}
                />

                {/* CustomerSelection moved to main Counter layout for improved spacing */}
                <div className="flex px-1 gap-4">
                    <Button
                        className="max-w-1/3 grow h-14 bg-red-400 border border-white/10 hover:bg-red-500/80 transition-colors text-md font-bold"
                        onClick={() => {
                            handleCancel();
                            onSuccess?.();
                        }}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>

                    <Button
                        className="w-2/3 grow h-14 text-md font-bold"
                        onClick={handleSubmit(handlePreview, (errors: any) => {
                            console.error("Form Validation Errors:", errors);
                            ErrorMessage("Verifique os campos obrigatórios");
                        })}
                        disabled={isPending}
                    >
                        {isPending ? "Processando..." : "Confirmar Pagamento"}
                    </Button>
                </div>

            </div>

            <PosInvoicePreviewDrawer
                open={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
                data={pendingPayload}
                cartItems={cartItems}
                onConfirm={handleFinalSubmit}
                isLoading={isPending}
                type={type}
            />

            <DocumentSuccessModal />
        </>
    );
}
