"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { CategorySelector, ProductList } from "./products";
import { CartList } from "./cart";
import { BarcodeProductScanner } from "./modals";
import { currentStoreStore } from "@/stores";
import { useGetCategories, useGetItems, useGetCurrentSession } from "@/hooks";
import { useQueryState } from "nuqs";
import {
  PosCategorySkeleton,
  PosProductSectionSkeleton,
  PosCartSkeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Button,
  Input,
  EmbeddedKeyboard,
} from "@/components";
import { CustomerSelection } from "./cart/checkout-form/customer-selection";
import {
  useCounterState,
  useRecommendations,
  useMindPricingConfig,
  useCartCheckout,
} from "@/hooks";
import { Sparkles } from "lucide-react";
import { PaymentMethods } from "./cart/checkout-form/payment-methods";
import { CartType, Product } from "@/types";

export function CounterContent() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search || "");
  const { categories, isLoading: isLoadingCategories } = useGetCategories();
  const [activeCart, setActiveCart] = useState<CartType>("invoice");
  const { currentStore } = currentStoreStore();
  const { data: currentSession } = useGetCurrentSession(currentStore?.id);

  // Default to the first category if available
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const { items: apiProducts, isLoading: isLoadingProducts } = useGetItems({
    search: debouncedSearch || undefined,
    categoryId: selectedCategory || undefined,
    type: "PRODUCT",
    limit: 100,
  });

  // Debounce the search query to reduce requests and improve UX
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search || ""), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Client-side refined filtering + relevance scoring to improve precision
  const filteredProducts = useMemo(() => {
    const s = (debouncedSearch || "").trim();
    if (!s) return (apiProducts || []) as any[];

    const normalize = (str: string) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const query = normalize(s);
    const tokens = query.split(/\s+/).filter(Boolean);
    const isNumeric = /^\d+$/.test(query.replace(/\s+/g, ""));

    return (apiProducts || [])
      .map((p: any) => {
        const name = normalize(p.name || "");
        const desc = normalize(p.description || "");
        const sku = String(p.sku || "").toLowerCase();
        const barcode = String(p.barcode || "").toLowerCase();

        let score = 0;

        // Numeric searches prefer barcode/sku exact or contains
        if (isNumeric) {
          if (barcode === query) score += 200;
          else if (sku === query) score += 190;
          else if (barcode.includes(query)) score += 120;
          else if (sku.includes(query)) score += 110;
        }

        // Exact name
        if (name === query) score += 150;
        // Starts with
        if (name.startsWith(query)) score += 120;
        // All tokens included
        if (tokens.every((t) => name.includes(t))) score += 80;
        // Partial matches
        if (name.includes(query)) score += 60;
        if (desc.includes(query)) score += 30;

        // SKU/barcode non-numeric fuzzy
        if (!isNumeric) {
          if (sku && sku.includes(query)) score += 40;
          if (barcode && barcode.includes(query)) score += 50;
        }

        // Boost items with stock quantity
        const qty = Number(p.quantity || p.reserved || 0);
        if (qty > 0) score += 5;

        return { item: p, score };
      })
      .filter((x: any) => x.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .map((x: any) => x.item);
  }, [apiProducts, debouncedSearch]);

  // Use custom hook for cart state management
  const {
    scannedProduct,
    onConfirmScan,
    handleAddToCart,
    handleRemoveFromCart,
    handleDeleteItem,
    handleUpdateQuantity,
    handleClearCart,
    getCartItemsArray,
  } = useCounterState({ apiProducts, activeCart });

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const currentCategoryName = useMemo(
    () => categories.find((c) => c.id === selectedCategory)?.name,
    [categories, selectedCategory],
  );

  const products: Product[] = useMemo(
    () =>
      (apiProducts as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price || 0,
        image: p.image,
        category: p.category?.name || "",
        quantity: p.quantity || p.reserved || 0,
        reserved: p.reserved || 0,
        description: p.description,
        barcode: p.barcode,
        sku: p.sku,
        tax:
          p.tax ||
          (typeof p.taxPercent === "number" || typeof p.taxPercent === "string"
            ? { id: "", name: "", rate: Number(p.taxPercent) }
            : undefined),
      })),
    [apiProducts],
  );

  const displayedProducts: Product[] = useMemo(() => {
    if (filteredProducts && filteredProducts.length > 0) {
      return filteredProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price || 0,
        image: p.image,
        category: p.category?.name || "",
        quantity: p.quantity || p.reserved || 0,
        reserved: p.reserved || 0,
        description: p.description,
        barcode: p.barcode,
        sku: p.sku,
        tax:
          p.tax ||
          (typeof p.taxPercent === "number" || typeof p.taxPercent === "string"
            ? { id: "", name: "", rate: Number(p.taxPercent) }
            : undefined),
      }));
    }

    return products;
  }, [filteredProducts, products]);

  const cartItemsMap = useMemo(
    () =>
      getCartItemsArray(activeCart).reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<string, any>,
      ),
    [activeCart, getCartItemsArray],
  );

  const handleUpdateQtyInvoice = useCallback(
    (item: any, delta: number) =>
      handleUpdateQuantity(item.id, item.qty + delta),
    [handleUpdateQuantity],
  );

  const handleUpdateQtyProforma = useCallback(
    (item: any, delta: number) =>
      handleUpdateQuantity(item.id, item.qty + delta),
    [handleUpdateQuantity],
  );

  const handleClearCartInvoice = useCallback(
    () => handleClearCart("invoice"),
    [handleClearCart],
  );
  const handleClearCartProforma = useCallback(
    () => handleClearCart("proforma"),
    [handleClearCart],
  );

  // Mind AI Recommendations based on active cart
  const { isRecommendationsEnabled } = useMindPricingConfig();
  const currentCartArray = getCartItemsArray(activeCart);
  const { recommendations, loading: loadingRecs } = useRecommendations(
    isRecommendationsEnabled ? currentCartArray : [],
  );
  const recommendedProducts = useMemo(() => {
    return recommendations
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];
  }, [recommendations, products]);

  const checkout = useCartCheckout({
    cartItems: getCartItemsArray(activeCart),
    type: activeCart,
    onSuccess:
      activeCart === "invoice"
        ? handleClearCartInvoice
        : handleClearCartProforma,
    cashSessionId: currentSession?.id || "",
  });

  const {
    paymentMethod,
    setPaymentMethod,
    cashGiven,
    setCashGiven,
    change,
    isCustomerExpanded,
    setIsCustomerExpanded,
    selectedClient,
    newCustomerPhone,
    setNewCustomerPhone,
    newCustomerNif,
    setNewCustomerNif,
    handleClientChange,
    handleQuickCash,
  } = checkout;

useEffect(() => {

  console.log("Selected client changed:", selectedClient);
  console.log("Selected client changed:", newCustomerPhone, " -- ", newCustomerNif);

}, [selectedClient, newCustomerPhone, newCustomerNif])

  useEffect(() => {
    if (activeCart === "proforma") {
      setIsCustomerExpanded(true);
    }
  }, [activeCart, setIsCustomerExpanded]);

  // Resizable keyboard state
  const controlPanelRef = useRef<HTMLDivElement | null>(null);
  const [keyboardWidth, setKeyboardWidth] = useState<number | null>(null);
  const isDraggingRef = useRef(false);

  const calculateKeyboardBounds = useCallback((available: number) => {
    // Allow the keyboard to shrink more aggressively on narrower screens
    const minKeyboard = Math.max(180, Math.round(available * 0.14));
    // Reserve a smaller right-side minimum so the right column can shrink
    const minRight = Math.max(220, Math.round(available * 0.18));
    const maxKeyboard = Math.max(
      Math.min(Math.round(available * 0.75), available - minRight),
      minKeyboard,
    );
    const preferred = Math.round(available * 0.42);
    return {
      minKeyboard,
      maxKeyboard,
      preferred: Math.min(Math.max(preferred, minKeyboard), maxKeyboard),
    };
  }, []);

  const updateKeyboardWidth = useCallback(() => {
    const el = controlPanelRef.current;
    if (!el) return;

    const available = el.clientWidth;
    const { minKeyboard, maxKeyboard, preferred } =
      calculateKeyboardBounds(available);

    setKeyboardWidth((current) => {
      if (current === null) return preferred;
      if (current < minKeyboard) return minKeyboard;
      if (current > maxKeyboard) return maxKeyboard;
      return current;
    });
  }, [calculateKeyboardBounds]);

  useEffect(() => {
    updateKeyboardWidth();
    window.addEventListener("resize", updateKeyboardWidth);
    return () => {
      window.removeEventListener("resize", updateKeyboardWidth);
    };
  }, [updateKeyboardWidth]);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const el = controlPanelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const available = rect.width;
      const { minKeyboard, maxKeyboard } = calculateKeyboardBounds(available);
      let newWidth = e.clientX - rect.left;
      newWidth = Math.max(minKeyboard, Math.min(newWidth, maxKeyboard));
      setKeyboardWidth(newWidth);
    },
    [calculateKeyboardBounds],
  );

  const onMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, [onMouseMove]);

  const onMouseDown = (e: any) => {
    e.preventDefault();
    isDraggingRef.current = true;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="flex flex-col xl:flex-row w-full h-full overflow-hidden min-h-0">
      {/* Left Section */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {/* Cash Session — 70% */}
        <div className="flex flex-[6.5] overflow-hidden">
          <BarcodeProductScanner
            scannedProduct={scannedProduct}
            onConfirm={onConfirmScan}
          />
          <div className="flex-1 flex flex-col min-w-0 gap-4">
            <div className="sticky top-0 z-20 bg-background dark:bg-[#121212] p-1">
              {isLoadingCategories ? (
                <PosCategorySkeleton />
              ) : (
                <CategorySelector
                  categories={categories}
                  activeCategory={selectedCategory}
                  onSelectCategory={handleCategorySelect}
                />
              )}
            </div>

            <ScrollArea className="flex-1 overflow-y-auto custom-scrollbar pb-2 px-4">
              {isLoadingProducts ? (
                <PosProductSectionSkeleton />
              ) : (
                <ProductList
                  products={displayedProducts}
                  cartItems={cartItemsMap}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Control Panel — 30% */}
        <div
          ref={controlPanelRef}
          className="flex flex-col lg:flex-row flex-[3.5] overflow-hidden bg-background dark:bg-[#121212] border-t border-border dark:border-white/10 min-h-[320px]"
        >
          {/* Left slot: Virtual Keyboard (resizable) */}
          <div
            className="h-full overflow-hidden transition-all duration-200"
            style={{
              width: keyboardWidth ? `${keyboardWidth}px` : "100%",
              minWidth: 280,
              maxWidth: "calc(100% - 340px)",
            }}
          >
            <EmbeddedKeyboard />
          </div>

          {/* Resizer handle */}
          <div
            role="separator"
            aria-orientation="vertical"
            onMouseDown={onMouseDown}
            className="hidden lg:block w-2 cursor-col-resize hover:bg-muted/20 dark:hover:bg-white/10 transition-colors"
            style={{ background: "transparent" }}
          />

          {/* Right slot: Payment Summary / Totals */}
          <div className="flex-1 h-full border-t border-border dark:border-white/10 lg:border-t-0 lg:border-l px-4 py-3 min-w-[220px]">
            <div className="w-full h-full flex flex-col gap-3">
              <div className="bg-muted/20 p-3 rounded-md border border-border dark:border-white/5 w-full">
                <div className="grid gap-3 lg:grid-cols-[min(0,1fr)_320px]">
                  <div className="min-w-[280px] w-full">
                    <PaymentMethods
                      paymentMethod={paymentMethod}
                      onMethodChange={setPaymentMethod}
                      cashGiven={cashGiven}
                      onCashChange={setCashGiven}
                      onQuickCash={handleQuickCash}
                      change={change}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {/* Placeholder for payment summary, totals or other controls */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content - Cart & Payment */}
      <div className="w-full xl:basis-[450px] basis-[320px] min-w-[240px] max-w-[520px] shrink-0 h-full flex flex-col border-l border-border dark:border-white/10 bg-background dark:bg-[#121212]">
        <div className="flex flex-col border-b justify-between">
          <div className="min-w-0 w-full p-2">
            <CustomerSelection
              isExpanded={isCustomerExpanded}
              onToggleExpand={() => setIsCustomerExpanded((s) => !s)}
              selectedClient={selectedClient}
              onClientChange={handleClientChange}
              newCustomerPhone={newCustomerPhone}
              onPhoneChange={setNewCustomerPhone}
              newCustomerNif={newCustomerNif}
              onNifChange={setNewCustomerNif}
              isProforma={activeCart === "proforma"}
            />
          </div>

          <div className="flex border-b items-center justify-between">
            <Tabs
              value={activeCart}
              onValueChange={(v) => setActiveCart(v as CartType)}
              className="flex-1 flex flex-col items-center"
            >
              <TabsList className="grid w-full grid-cols-2 m-4 mb-2">
                <TabsTrigger value="invoice" className="cursor-pointer">
                  Faturação
                </TabsTrigger>
                <TabsTrigger value="proforma" className="cursor-pointer">
                  Proforma
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Mind AI Recommendations Tooltip */}
            {currentCartArray.length > 0 && (
              <div className="pr-4 pb-0 items-center justify-center flex">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 border-primary/30 text-primary relative"
                      >
                        <Sparkles className="w-4 h-4" />
                        {!loadingRecs && recommendedProducts.length > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="w-[300px] p-4 border bg-background text-foreground shadow-lg"
                    >
                      <div className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                        <Sparkles className="w-4 h-4" /> Mind AI Sugere:
                      </div>
                      {loadingRecs ? (
                        <div className="text-sm text-muted-foreground animate-pulse text-center p-4">
                          A analisar o cesto...
                        </div>
                      ) : recommendedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {recommendedProducts.slice(0, 2).map((p) => (
                            <button
                              key={p.id}
                              onClick={() => handleAddToCart(p)}
                              className="flex flex-col items-center p-2 rounded border hover:bg-muted hover:border-primary transition-colors text-xs text-center wrap-break-word"
                            >
                              <span className="font-medium truncate w-full">
                                {p.name}
                              </span>
                              <span className="text-muted-foreground mt-1 text-xs">
                                +{(p.price || 0).toFixed(2)}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground text-center p-2">
                          Sem sugestões de momento.
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>

        <Tabs
          value={activeCart}
          onValueChange={(v) => setActiveCart(v as CartType)}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          {/* CORREÇÃO NOS TABS CONTENT: 
            Adicionado 'data-[state=active]:flex h-full flex-col min-h-0' 
            Isso obriga o Radix UI a se comportar como um flexbox de tamanho rígido.
          */}
          <TabsContent
            value="invoice"
            className="mt-0 h-full min-h-0 data-[state=active]:flex flex-col overflow-hidden"
          >
            {isLoadingCategories || !currentSession?.id ? (
              <PosCartSkeleton />
            ) : (
              <CartList
                type="invoice"
                cartItems={getCartItemsArray("invoice")}
                onUpdateQty={handleUpdateQtyInvoice}
                onRemove={handleRemoveFromCart}
                onDelete={handleDeleteItem}
                onClearCart={handleClearCartInvoice}
                cashSessionId={currentSession.id}
                checkout={checkout}
              />
            )}
          </TabsContent>

          <TabsContent
            value="proforma"
            className="mt-0 h-full min-h-0 data-[state=active]:flex flex-col overflow-hidden"
          >
            {isLoadingCategories || !currentSession?.id ? (
              <PosCartSkeleton />
            ) : (
              <CartList
                type="proforma"
                cartItems={getCartItemsArray("proforma")}
                onUpdateQty={handleUpdateQtyProforma}
                onRemove={handleRemoveFromCart}
                onDelete={handleDeleteItem}
                onClearCart={handleClearCartProforma}
                cashSessionId={currentSession.id}
                checkout={checkout}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
