"use client";

import { useState } from "react";
import { Button, Icon } from "@/components";
import { ErrorMessage } from "@/utils";
import { useCartCheckout, CartItem } from "@/hooks";
import { PaymentSummary } from "./payment-summary";
import { CustomerSelection } from "./customer-selection";
import { PaymentMethods } from "./payment-methods";
import { PrintSaleDialog } from "./print-sale-dialog";
import { CheckoutInvoicePreviewDrawer } from "./checkout-preview-drawer";

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
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
        newCustomerName,
        setNewCustomerName,
        newCustomerTaxNumber,
        setNewCustomerTaxNumber,
        newCustomerAddress,
        setNewCustomerAddress,
        setNewCustomerVerification,
        selectedClient,
        handleClientChange,
        handleQuickCash,
        handleCheckout,
        printDocument,
        handlePrint,
        dismissPrint,
        isPrinting,
        isPending,
    } = useCartCheckout({ cartItems, type, onSuccess, cashSessionId });

    const handleValidationError = (errors: any) => {
        console.error("Form Validation Errors:", errors);

        if (errors?.items) {
            ErrorMessage("Adicione pelo menos um produto ao carrinho antes de criar a factura-recibo.");
            return;
        }

        ErrorMessage("Verifique os campos obrigatórios.");
    };

    const currentClientData = selectedClient || (newCustomerName ? {
        name: newCustomerName,
        taxNumber: newCustomerTaxNumber,
        phone: newCustomerPhone,
        address: newCustomerAddress,
    } : null);

    return (
        <>
            <div
                className="mt-4 p-4 border border-dashed rounded-md bg-muted/30"
                data-tour="pos-checkout"
            >
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
                    newCustomerName={newCustomerName}
                    onNameChange={setNewCustomerName}
                    newCustomerTaxNumber={newCustomerTaxNumber}
                    onTaxNumberChange={setNewCustomerTaxNumber}
                    newCustomerAddress={newCustomerAddress}
                    onAddressChange={setNewCustomerAddress}
                    onVerificationStatusChange={setNewCustomerVerification}
                />

                <PaymentMethods
                    paymentMethod={paymentMethod}
                    onMethodChange={setPaymentMethod}
                    cashGiven={cashGiven}
                    onCashChange={setCashGiven}
                    onQuickCash={handleQuickCash}
                    change={change}
                />

                <div className="pt-2">
                    <Button
                        type="button"
                        className="w-full shadow-md font-semibold"
                        onClick={() => {
                            if (!cartItems || cartItems.length === 0) {
                                ErrorMessage("Adicione pelo menos um item ao carrinho para emitir a fatura.");
                                return;
                            }
                            handleSubmit(
                                () => setIsPreviewOpen(true),
                                handleValidationError
                            )();
                        }}
                        disabled={isPending}
                        data-tour="pos-submit"
                    >
                        {isPending ? "A processar..." : "Confirmar pagamento"}
                    </Button>
                </div>
            </div>

            <CheckoutInvoicePreviewDrawer
                open={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
                cartItems={cartItems}
                totals={totals}
                paymentMethod={paymentMethod}
                cashGiven={cashGiven}
                change={change}
                client={currentClientData}
                type={type}
                onConfirm={() => {
                    setIsPreviewOpen(false);
                    handleSubmit(handleCheckout, handleValidationError)();
                }}
                isPending={isPending}
            />

            <PrintSaleDialog
                document={printDocument}
                isPrinting={isPrinting}
                onPrint={handlePrint}
                onDismiss={dismissPrint}
            />
        </>
    );
}
