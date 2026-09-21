"use client";

import { useState } from "react";
import { useCartCheckout, CartItem } from "@/hooks";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter,
  Button,
  Icon
} from "@/components";
import { PaymentSummary } from "../counter/cart/checkout-form/payment-summary";
import { CustomerSelection } from "../counter/cart/checkout-form/customer-selection";
import { PaymentMethods } from "../counter/cart/checkout-form/payment-methods";
import { ErrorMessage } from "@/utils";
import { PrintSaleDialog } from "../counter/cart/checkout-form/print-sale-dialog";
import { CheckoutInvoicePreviewDrawer } from "../counter/cart/checkout-form/checkout-preview-drawer";

interface MobileCheckoutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  onSuccess?: () => void;
  type?: "invoice" | "proforma";
  cashSessionId: string;
}

export function MobileCheckoutDrawer({
  open,
  onOpenChange,
  cartItems,
  onSuccess,
  type = "invoice",
  cashSessionId
}: MobileCheckoutDrawerProps) {
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
  } = useCartCheckout({ cartItems, type, onSuccess: () => {
    onSuccess?.();
    onOpenChange(false);
  }, cashSessionId });

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
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
          <DrawerHeader className="border-b px-4 py-3 flex-shrink-0 flex items-center justify-between">
            <DrawerTitle className="text-base font-bold">
              {type === "invoice" ? "Finalizar Pagamento" : "Finalizar Proforma"}
            </DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2"
              onClick={() => onOpenChange(false)}
            >
              <Icon name="X" className="h-4 w-4" />
            </Button>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          </div>

          <DrawerFooter className="pt-2 border-t">
            <Button
                type="button"
                className="w-full h-12 text-base font-bold shadow-md"
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
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
