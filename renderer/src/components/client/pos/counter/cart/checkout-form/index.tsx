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
            <div className="mt-4 p-4 border border-dashed rounded-md bg-muted/30">
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
                    onToggleExpand={() => setIsCustomerExpanded(!isCustomerExpanded)}
                    selectedClient={selectedClient}
                    onClientChange={handleClientChange}
                    newCustomerPhone={newCustomerPhone}
                    onPhoneChange={setNewCustomerPhone}
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
