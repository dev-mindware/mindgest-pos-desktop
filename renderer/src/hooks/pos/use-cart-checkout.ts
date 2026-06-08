"use client";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateInvoiceReceipt, useCreateProforma } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { currentStoreStore, useAuthStore, useModal } from "@/stores";
import { ErrorMessage, formatCurrency, parseCurrency } from "@/utils";
import { useClientSelection } from "@/hooks/invoice";
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
  const queryClient = useQueryClient();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Credit Card");
  const [cashGiven, setCashGiven] = useState<number | "">("");
  const [change, setChange] = useState<number>(0);


  const [isCustomerExpanded, setIsCustomerExpanded] = useState(false);
  const [newCustomerNif, setNewCustomerNif] = useState("");
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

  const { handleSubmit, setValue, watch, reset, register } = form;
  const { handleClientChange, selectedClient, setSelectedClient } =
    useClientSelection(setValue);

  useEffect(() => {
    register("client");
  }, [register]);

  const watchedItems = watch("items") as any[];

  const cartTotals = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return acc + price * qty;
    }, 0);

    const discountAmount = 0;
    const taxAmount = cartItems.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      const rate = Number(item.tax?.rate ?? (item as any).taxPercent ?? 0) || 0;
      return acc + price * qty * (rate / 100);
    }, 0);

    const total = subtotal + taxAmount - discountAmount;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }, [cartItems]);

  const totals = cartTotals;

  // Synchronize cartItems with form items
  useEffect(() => {
    const items = cartItems.map((item) => ({
      id: (item as any).cloudId || item.id,
      quantity: item.qty,
    }));

    const sameItems =
      items.length === watchedItems.length &&
      items.every((item, index) => {
        const watched = watchedItems[index];
        return watched?.id === item.id && watched?.quantity === item.quantity;
      });

    if (sameItems) {
      return;
    }

    console.log("✅ [CartCheckout] Items synced to form (with cloudId as id):", items);
    setValue("items", items as any, { shouldValidate: false });
  }, [cartItems, setValue, watchedItems]);

  // Synchronize totals to form state
  useEffect(() => {
    setValue("total", cartTotals.total);
    setValue("subtotal", cartTotals.subtotal);
    setValue("taxAmount", cartTotals.taxAmount);
    setValue("discountAmount", cartTotals.discountAmount);
  }, [cartTotals, setValue]);

  // Synchronize payment method
  useEffect(() => {
    setValue("paymentMethod", paymentMethod === "Cash" ? "CASH" : "CARD");
  }, [paymentMethod, setValue]);

  // Synchronize storeId
  useEffect(() => {
    const id = currentStore?.id || user?.store?.id;
    if (id) setValue("storeId", id);
  }, [currentStore, user, setValue]);

  // Synchronize cashSessionId (always set, even if empty, to handle form reset)
  useEffect(() => {
    setValue("cashSessionId", cashSessionId || "");
  }, [cashSessionId, setValue]);

  // Handle Cash & Change
  useEffect(() => {
    if (paymentMethod === "Cash") {
      const cash = typeof cashGiven === "number" ? cashGiven : 0;
      const changeVal = cash >= cartTotals.total ? cash - cartTotals.total : 0;
      const safeChange = isNaN(changeVal) ? 0 : Number(changeVal.toFixed(2));

      setChange(safeChange);
      setValue("receivedValue", cash);
      setValue("change", safeChange, { shouldValidate: true });
    } else {
      setChange(0);
      setValue("receivedValue", cartTotals.total);
      setValue("change", 0, { shouldValidate: true });
    }
  }, [cashGiven, cartTotals.total, paymentMethod, setValue]);

  const handleQuickCash = (amount: number) => {
    setCashGiven(amount);
  };

  const handleCancel = () => {
    setCashGiven("");
    setPaymentMethod("Credit Card");
    setChange(0);
    setSelectedClient(null);
    setNewCustomerPhone("");
    setNewCustomerNif("");
    reset({
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
      cashSessionId: cashSessionId || "", // Preserve cashSessionId
    });
    setIsPreviewOpen(false);
    setPendingPayload(null);
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

    const simplifiedItems = await Promise.all(
      cartItems.map(async (item) => {
        const cloudId = (item as any).cloudId ||
          (typeof window !== "undefined" && window.ipc?.db?.getItemCloudId
            ? await window.ipc.db.getItemCloudId(item.id)
            : item.id);

        if (!cloudId) {
          console.warn(
            "⚠️ [CartCheckout] Não foi possível resolver cloudId para o item:",
            item.id,
          );
        }

        return {
          id: cloudId,
          quantity: item.qty,
        };
      }),
    );

    console.log("✅ [CartCheckout] Items ready for cloud (id=cloudId):", simplifiedItems);
    console.log("✅ [CartCheckout] selectedClient:", selectedClient);
    console.log(data);

    let finalClient = undefined;
    if (data.client && (data.client.id || (data.client.name && data.client.name.trim() !== ""))) {
      const c: any = {};
      if (data.client.id) c.id = data.client.id;
      if (data.client.name && data.client.name.trim() !== "") c.name = data.client.name.trim();
      if (data.client.phone && data.client.phone.trim() !== "") c.phone = data.client.phone.trim();
      if (data.client.email && data.client.email.trim() !== "") c.email = data.client.email.trim();
      if (data.client.address && data.client.address.trim() !== "") c.address = data.client.address.trim();
      if (data.client.taxNumber && data.client.taxNumber.trim() !== "") c.taxNumber = data.client.taxNumber.trim();
      if (data.client.nif && data.client.nif.trim() !== "") c.nif = data.client.nif.trim();

      if (Object.keys(c).length > 0) finalClient = c;
    }

    if (!finalClient && data.clientId) {
      finalClient = { id: data.clientId };
    }

    // If the form did not populate `client`, fall back to `selectedClient` (selection UI)
    if (!finalClient && selectedClient) {
      const option: any = selectedClient;
      if (option.__isNew__) {
        finalClient = { name: option.label };
      } else if (option.data) {
        const d = option.data;
        const c: any = {
          id: d.id,
          name: d.name,
          taxNumber: d.taxNumber || undefined,
          address: d.address || undefined,
          phone: d.phone || undefined,
        };
        // Remove undefined/empty fields
        Object.keys(c).forEach((k) => {
          if (c[k] === undefined || (typeof c[k] === "string" && c[k].trim() === "")) delete c[k];
        });
        if (Object.keys(c).length > 0) finalClient = c;
      }
    }

    const payload: PosSalesFormData = {
      ...data,
      items: simplifiedItems,
      storeId: currentStore?.id || user?.store?.id || data.storeId,
      subtotal: cartTotals.subtotal,
      taxAmount: cartTotals.taxAmount,
      documentType: type === "proforma" ? "FP" : "FR",
      discountAmount: cartTotals.discountAmount,
      total: cartTotals.total,
      change:
        typeof data.change === "number" && !isNaN(data.change)
          ? Number(data.change.toFixed(2))
          : 0,
      cashSessionId,
    };

    if (finalClient) {
      payload.client = finalClient;
    } else {
      delete (payload as any).client;
    }

    // If creating a new anonymous customer by phone/NIF, build minimal client object
    if ((!selectedClient || selectedClient.__isNew__) && (newCustomerPhone || newCustomerNif)) {
      payload.client = payload.client || {};
      payload.client.name = payload.client.name || "Consumidor Final";

      if (newCustomerPhone && typeof newCustomerPhone === "string" && newCustomerPhone.trim() !== "") {
        payload.client.phone = newCustomerPhone.trim();
      }

      if (newCustomerNif && typeof newCustomerNif === "string" && newCustomerNif.trim() !== "") {
        // prefer taxNumber field used elsewhere
        payload.client.taxNumber = newCustomerNif.trim();
      }

      // sensible defaults (do not include if empty)
      if (!payload.client.email) delete payload.client.email;
      if (!payload.client.address) delete payload.client.address;
    }

    // Remove any empty string / null / undefined fields from client before sending
    if (payload.client) {
      for (const k of Object.keys(payload.client)) {
        const v = (payload.client as any)[k];
        if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
          delete (payload.client as any)[k];
        }
      }
      if (Object.keys(payload.client).length === 0) {
        delete (payload as any).client;
      }
    }

    // Validation: Proforma Invoices require an identified client
    if (type === "proforma" && !payload.client) {
      ErrorMessage("É obrigatório identificar o cliente para emitir uma Fatura Proforma.");
      return;
    }

    if (payload.receivedValue === 0) {
      delete (payload as any).receivedValue;
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
        const invoiceId = response?.data?.id || response?.localId;
        const invoiceNumber = response?.data?.agtNo || response?.data?.invoiceNumber || response?.data?.number || "PENDENTE OFFLINE";

        console.log("📋 [Checkout] Invoice creation response:", JSON.stringify(response, null, 2));
        console.log("📋 [Checkout] Extracted invoiceNumber:", invoiceNumber);
        console.log("📋 [Checkout] Response.data:", JSON.stringify(response?.data, null, 2));

        if (invoiceId) {
          // Enrich payload with response data and full item details
          const enrichedPayload = {
            ...pendingPayload,
            invoiceNumber: invoiceNumber,
            invoiceDate: new Date().toISOString().split('T')[0],
            items: (cartItems || []).map((item) => ({
              name: item.name,
              description: item.description,
              quantity: item.qty,
              price: item.price,
              tax: item.tax?.rate || 0,
            })),
            company: {
              name: currentStore?.name || "A Minha Empresa",
              address: currentStore?.address || "Endereço da Empresa",
              email: currentStore?.email || "geral@empresa.com",
              phone: currentStore?.phone || "900000000",
              taxNumber: "000000000",
            },
          };

          openModal("document-success", {
            id: invoiceId,
            type: "invoice-receipt",
            format: "thermal",
            payload: enrichedPayload,
          });

          // 🔄 Force synchronization after successful invoice creation
          if (typeof window !== "undefined" && window.ipc?.sync?.triggerSync) {
            const storeId = currentStore?.id || user?.store?.id || "";
            const token = (user as any)?.token || localStorage.getItem("auth_token") || "";
            if (token && storeId && user?.id) {
              try {
                console.log("🔄 [Checkout] Triggering sync after invoice creation...");
                window.ipc.sync.triggerSync({
                  token,
                  storeId,
                  userId: user.id,
                });
              } catch (syncErr) {
                console.warn("⚠️ [Checkout] Erro ao forçar sincronização:", syncErr);
              }
            }
          }
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
        const proformaId = response?.data?.id || response?.localId;
        const proformaNumber = response?.data?.proformaNumber || response?.data?.number || response?.data?.invoiceNumber || "PENDENTE OFFLINE";

        console.log("📋 [Checkout] Proforma creation response:", JSON.stringify(response, null, 2));
        console.log("📋 [Checkout] Extracted proformaNumber:", proformaNumber);
        console.log("📋 [Checkout] Response.data:", JSON.stringify(response?.data, null, 2));

        console.log("Proforma creation response:");
        console.log(response);

        if (proformaId) {
          // Enrich payload with response data and full item details
          const enrichedPayload = {
            ...pendingPayload,
            invoiceNumber: proformaNumber,
            invoiceDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            items: (cartItems || []).map((item) => ({
              name: item.name,
              description: item.description,
              quantity: item.qty,
              price: item.price,
              tax: item.tax?.rate || 0,
            })),
            company: {
              name: currentStore?.name || "A Minha Empresa",
              address: currentStore?.address || "Endereço da Empresa",
              email: currentStore?.email || "geral@empresa.com",
              phone: currentStore?.phone || "900000000",
              taxNumber: "000000000",
            },
          };

          openModal("document-success", {
            id: proformaId,
            type: "proforma",
            format: "thermal",
            payload: enrichedPayload,
          });

          // 🔄 Force synchronization after successful proforma creation
          if (typeof window !== "undefined" && window.ipc?.sync?.triggerSync) {
            const storeId = currentStore?.id || user?.store?.id || "";
            const token = (user as any)?.token || localStorage.getItem("auth_token") || "";
            if (token && storeId && user?.id) {
              try {
                console.log("🔄 [Checkout] Triggering sync after proforma creation...");
                window.ipc.sync.triggerSync({
                  token,
                  storeId,
                  userId: user.id,
                });
              } catch (syncErr) {
                console.warn("⚠️ [Checkout] Erro ao forçar sincronização:", syncErr);
              }
            }
          }
        }
      }

      // NOVIDADE: Reduzir o stock localmente no SQLite para atualizar a UI do POS imediatamente
      if (typeof window !== "undefined" && window.ipc?.sync?.reduceLocalStock) {
        try {
          const stockItems = cartItems.map(item => ({ id: item.id, quantity: item.qty }));
          await window.ipc.sync.reduceLocalStock(stockItems);
          console.log("✅ Stock local descontado com sucesso.");

          // Disparar evento para atualizar a UI em tempo real
          window.dispatchEvent(new CustomEvent("local-stock-updated"));

          // Invalidate React Query caches to trigger real-time UI refresh
          queryClient.invalidateQueries({
            predicate: (query) => {
              const key = query.queryKey[0];
              return typeof key === "string" && (
                key.startsWith("items-for-pos") ||
                key.includes("items") ||
                key.includes("products")
              );
            }
          });
        } catch (stockErr) {
          console.error("❌ Erro ao descontar stock local:", stockErr);
        }
      }

      setCashGiven("");
      setSelectedClient(null);
      setNewCustomerPhone("");
      reset({
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
        cashSessionId: cashSessionId || "", // Preserve cashSessionId
      });
      setIsPreviewOpen(false);
      setPendingPayload(null);
      onSuccess?.();
    } catch (error: any) {
      console.error("Payment error:", error);
      const backendMessage =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || error?.message || null;
      ErrorMessage(
        backendMessage || `Erro ao processar ${type === "invoice" ? "o pagamento" : "a proforma"}.`,
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
    newCustomerNif,
    setNewCustomerNif,
    selectedClient,
    handleClientChange,
    handleQuickCash,
    handlePreview,
    handleFinalSubmit,
    handleCancel,
    isPreviewOpen,
    setIsPreviewOpen,
    pendingPayload,
    isPending,
  };
}
