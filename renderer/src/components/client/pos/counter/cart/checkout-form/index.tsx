"use client";

import { Button } from "@/components";
import { InvoicePreviewDrawer as PosInvoicePreviewDrawer } from "../../modals/invoice-preview-drawer";
import { ErrorMessage } from "@/utils";
import { useCartCheckout, CartItem } from "@/hooks";
import { PaymentSummary } from "./payment-summary";
import { CustomerSelection } from "./customer-selection";
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
    const checkout = useCartCheckout({
        cartItems,
        type,
        onSuccess,
        cashSessionId,
    });

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
        handleCancel,
        handleFinalSubmit,
        isPreviewOpen,
        setIsPreviewOpen,
        pendingPayload,
        isPending,
    } = checkout;

    return (
        <>
            <div className="mt-4 p-4 flex flex-col gap-4 bg-muted/30 border border-dashed rounded-test-md" data-tour="pos-checkout">
                <PaymentSummary
                    subtotal={totals.subtotal}
                    taxAmount={totals.taxAmount}
                    discountAmount={totals.discountAmount}
                    total={totals.total}
                    change={change}
                    paymentMethod={paymentMethod}
                />

                <CustomerSelection
                    isExpanded={isCustomerExpanded}
                    onToggleExpand={() => setIsCustomerExpanded((s: boolean) => !s)}
                    selectedClient={selectedClient}
                    onClientChange={handleClientChange}
                    newCustomerPhone={newCustomerPhone}
                    onPhoneChange={setNewCustomerPhone}
                    newCustomerNif={newCustomerNif}
                    onNifChange={setNewCustomerNif}
                    isProforma={type === "proforma"}
                />

                <PaymentMethods
                    paymentMethod={paymentMethod}
                    onMethodChange={setPaymentMethod}
                    cashGiven={cashGiven}
                    onCashChange={setCashGiven}
                    onQuickCash={handleQuickCash}
                    change={change}
                />

                <Button
                    type="button"
                    className="w-full font-bold text-sm"
                    onClick={handleSubmit(handlePreview, (errors: any) => {
                        console.error("Form Validation Errors:", errors);
                        ErrorMessage("Verifique os campos obrigatórios");
                    })}
                    disabled={isPending}
                    data-tour="pos-submit"
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

