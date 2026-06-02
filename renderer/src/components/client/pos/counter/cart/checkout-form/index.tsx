"use client";

import { Button } from "@/components";
import { InvoicePreviewDrawer as PosInvoicePreviewDrawer } from "../../modals/invoice-preview-drawer";
import { ErrorMessage } from "@/utils";
import { useCartCheckout, CartItem } from "@/hooks";
import { PaymentSummary } from "./payment-summary";
import { PaymentMethods } from "./payment-methods";
import { DocumentSuccessModal } from "@/components/client/documents/modals/document-success-modal";

interface CartCheckoutFormProps {
    cartItems: CartItem[];
    onSuccess?: () => void;
    type?: "invoice" | "proforma";
    cashSessionId: string;
}

export function CartCheckoutForm({
    cartItems,
    onSuccess,
    type = "invoice",
    cashSessionId,
}: CartCheckoutFormProps) {
    const {
        form: { handleSubmit },
        paymentMethod,
        setPaymentMethod,
        cashGiven,
        setCashGiven,
        change,
        totals,
        isCustomerExpanded,
        setIsCustomerExpanded,
        newCustomerPhone,
        setNewCustomerPhone,
        newCustomerNif,
        setNewCustomerNif,
        selectedClient,
        handleClientChange,
        handleQuickCash,
        handlePreview,
        handleFinalSubmit,
        isPreviewOpen,
        setIsPreviewOpen,
        pendingPayload,
        isPending,
    } = useCartCheckout({ cartItems, type, onSuccess, cashSessionId });

    return (
        <>
            <div className="p-2 border border-dashed rounded-test-md bg-muted/30">
                <PaymentSummary
                    subtotal={totals.subtotal}
                    taxAmount={totals.taxAmount}
                    discountAmount={totals.discountAmount}
                    total={totals.total}
                    change={change}
                    paymentMethod={paymentMethod}
                />

                {/* CustomerSelection moved to main Counter layout for improved spacing */}

                <PaymentMethods
                    paymentMethod={paymentMethod}
                    onMethodChange={setPaymentMethod}
                    cashGiven={cashGiven}
                    onCashChange={setCashGiven}
                    onQuickCash={handleQuickCash}
                    change={change}
                />

                <Button
                    className="w-full"
                    onClick={handleSubmit(handlePreview, (errors) => {
                        console.error("Form Validation Errors:", errors);
                        ErrorMessage("Verifique os campos obrigatórios");
                    })}
                    disabled={isPending}
                >
                    {isPending ? "Processando..." : "Confirmar Pagamento"}
                </Button>
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
