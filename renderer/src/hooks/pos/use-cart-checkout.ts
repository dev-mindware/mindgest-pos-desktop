"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateInvoiceReceipt, useCreateProforma } from "@/hooks";
import { currentStoreStore, useAuthStore, useModal } from "@/stores";
import { ErrorMessage, formatCurrency, parseCurrency } from "@/utils";
import { useInvoiceTotals, useClientSelection } from "@/hooks/invoice";
import { PosSalesFormData, PosSalesSchema } from "@/schemas";
import { Product } from "@/types";

export interface CartItem extends Product {
  qty: number;
}

export type PaymentMethod = "Credit Card" | "Cash";

interface UseCartCheckoutProps {
  cartItems: CartItem[];
  type?: "invoice" | "proforma";
  onSuccess?: () => void;
  cashSessionId: string;
}

export function useCartCheckout({
  cartItems,
  type = "invoice",
  onSuccess,
  cashSessionId,
}: UseCartCheckoutProps) {
  const { user } = useAuthStore();
  const { currentStore } = currentStoreStore();
  const { openModal } = useModal();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Credit Card");
  const [cashGiven, setCashGiven] = useState<number | "">("");
  const [change, setChange] = useState<number>(0);

  const [isCustomerExpanded, setIsCustomerExpanded] = useState(false);
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<PosSalesFormData | null>(
    null,
  );

  const { mutateAsync: createInvoiceReceipt, isPending: isPendingInvoice } =
    useCreateInvoiceReceipt();
  const { mutateAsync: createProforma, isPending: isPendingProforma } =
    useCreateProforma();

  const isPending = isPendingInvoice || isPendingProforma;

  const form = useForm({
    resolver: zodResolver(PosSalesSchema),
    defaultValues: {
      issueDate: new Date().toLocaleDateString("en-CA"),
      items: [],
      client: undefined,
      storeId: currentStore?.id || user?.store?.id || "",
      total: 0,
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      receivedValue: 0,
      change: 0,
      paymentMethod: "CARD",
      cashSessionId: cashSessionId || "",
    },
  });

  const { handleSubmit, setValue, watch, reset } = form;
  const { handleClientChange, selectedClient, setSelectedClient } =
    useClientSelection(setValue);

  const watchedItems = watch("items") as any[];
  const totals = useInvoiceTotals({
    items: watchedItems || [],
    retention: 0,
    discount: 0, // POS não usa desconto global
  });

  // Synchronize cartItems with form items
  useEffect(() => {
    const items = cartItems.map((item) => ({
      id: item.id,
      description: item.name,
      type: "PRODUCT" as const,
      quantity: item.qty,
      unitPrice: item.price || 0,
      tax: Number((item as any).tax?.rate || (item as any).taxRate || 0), // ✅ Convert string to number
      discount: 0,
      total: (item.price || 0) * item.qty,
      isFromAPI: true,
    }));

    setValue("items", items as any, { shouldValidate: true });
  }, [cartItems, setValue]);

  // Synchronize totals to form state
  useEffect(() => {
    setValue("total", totals.total);
    setValue("subtotal", totals.subtotal);
    setValue("taxAmount", totals.taxAmount);
    setValue("discountAmount", totals.discountAmount);
  }, [totals, setValue]);

  // Synchronize payment method
  useEffect(() => {
    setValue("paymentMethod", paymentMethod === "Cash" ? "CASH" : "CARD");
  }, [paymentMethod, setValue]);

  // Synchronize storeId
  useEffect(() => {
    const id = currentStore?.id || user?.store?.id;
    if (id) setValue("storeId", id);
  }, [currentStore, user, setValue]);

  // Synchronize cashSessionId
  useEffect(() => {
    if (cashSessionId) {
      setValue("cashSessionId", cashSessionId);
    }
  }, [cashSessionId, setValue]);

  // Handle Cash & Change
  useEffect(() => {
    if (paymentMethod === "Cash") {
      const cash = typeof cashGiven === "number" ? cashGiven : 0;
      const changeVal = cash >= totals.total ? cash - totals.total : 0;
      const safeChange = isNaN(changeVal) ? 0 : Number(changeVal.toFixed(2));

      setChange(safeChange);
      setValue("receivedValue", cash);
      setValue("change", safeChange, { shouldValidate: true });
    } else {
      setChange(0);
      setValue("receivedValue", totals.total);
      setValue("change", 0, { shouldValidate: true });
    }
  }, [cashGiven, totals.total, paymentMethod, setValue]);

  const handleQuickCash = (amount: number) => {
    setCashGiven(amount);
  };

  const handlePreview = async (data: any) => {
    if (cartItems.length === 0) {
      ErrorMessage("O carrinho está vazio!");
      return;
    }

    // Validate cashSessionId
    if (!cashSessionId) {
      ErrorMessage("Sessão de caixa não identificada. Recarregue a página.");
      console.error("cashSessionId is missing:", cashSessionId);
      return;
    }

    // Prepare payload
    const simplifiedItems = data.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const payload: PosSalesFormData = {
      ...data,
      items: simplifiedItems,
      client: data.client,
      storeId: currentStore?.id || user?.store?.id || data.storeId,
      change:
        typeof data.change === "number" && !isNaN(data.change)
          ? Number(data.change.toFixed(2))
          : 0,
      cashSessionId,
    };

    if (!payload.storeId) {
      ErrorMessage("Loja não identificada. Recarregue a página.");
      return;
    }

    // Custom adjustments for client
    if (!selectedClient && newCustomerPhone) {
      payload.client = {
        name: "Consumidor Final",
        phone: newCustomerPhone,
        email: "consumidor@final.com",
        address: "Loja",
        taxNumber: "999999999",
      };
    }

    setPendingPayload(payload);
    setIsPreviewOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!pendingPayload) return;

    try {
      console.log("FINAL PAYLOAD:", JSON.stringify(pendingPayload, null, 2));
      if (type === "invoice") {
        const response = await createInvoiceReceipt(pendingPayload as any);
        const invoiceId = response?.data?.id;

        if (invoiceId) {
          openModal("document-success", {
            id: invoiceId,
            type: "invoice-receipt",
            format: "thermal",
          });
        }
      } else {
        // Remove payment-specific fields for proforma
        const { cashSessionId, change, receivedValue, ...proformaData } =
          pendingPayload;

        const proformaPayload = {
          ...proformaData,
          proformaExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        };
        const response = await createProforma(proformaPayload as any);
        const proformaId = response?.data?.id;

        if (proformaId) {
          openModal("document-success", {
            id: proformaId,
            type: "proforma",
            format: "thermal",
          });
        }
      }

      setCashGiven("");
      setSelectedClient(null);
      setNewCustomerPhone("");
      reset();
      setIsPreviewOpen(false);
      setPendingPayload(null);
      onSuccess?.();
    } catch (error: any) {
      console.error("Payment error:", error);
      ErrorMessage(
        `Erro ao processar ${type === "invoice" ? "o pagamento" : "a proforma"}.`,
      );
    }
  };

  return {
    form,
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
  };
}
