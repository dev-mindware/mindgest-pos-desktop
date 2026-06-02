"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
    search: search || undefined,
    categoryId: selectedCategory || undefined,
    type: "PRODUCT",
    limit: 100,
  });

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
      activeCart === "invoice" ? handleClearCartInvoice : handleClearCartProforma,
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

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Left Section */}
      <div className="flex w-full flex-col h-full overflow-hidden">
        {/* Cash Session — 70% */}
        <div className="flex flex-[6.5] overflow-hidden">
          <BarcodeProductScanner
            scannedProduct={scannedProduct}
            onConfirm={onConfirmScan}
          />
          <div className="flex-1 flex flex-col min-w-0 gap-4 p-4">
            {isLoadingCategories ? (
              <PosCategorySkeleton />
            ) : (
              <CategorySelector
                categories={categories}
                activeCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
            )}

            <ScrollArea className="flex-1 pb-4">
              {isLoadingProducts ? (
                <PosProductSectionSkeleton />
              ) : (
                <ProductList
                  products={products}
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
        <div className="flex flex-[3.5] overflow-hidden bg-[#121212] border-t border-white/10">
          {/* Left slot: Virtual Keyboard */}
          <div className="flex flex-[2] h-full overflow-hidden">
            <EmbeddedKeyboard />
          </div>
          {/* Right slot: Payment Summary / Totals */}
          <div className="flex flex-[3] h-full border-l border-white/10 px-4 py-3">
            <div className="w-full h-full flex flex-col gap-3">
              <div className="bg-muted/20 p-3 rounded-md border border-white/5">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="min-w-0">
                    <CustomerSelection
                      isExpanded={isCustomerExpanded}
                      onToggleExpand={() => setIsCustomerExpanded((s) => !s)}
                      selectedClient={selectedClient}
                      onClientChange={handleClientChange}
                      newCustomerPhone={newCustomerPhone}
                      onPhoneChange={setNewCustomerPhone}
                      newCustomerNif={newCustomerNif}
                      onNifChange={setNewCustomerNif}
                    />
                  </div>

                  <div className="min-w-[280px]">
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
      <div className="w-[500px] h-full flex flex-col border-l border-white/10 bg-[#121212]">
        <div className="flex border-b items-center justify-between">
          <Tabs
            value={activeCart}
            onValueChange={(v) => setActiveCart(v as CartType)}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2 m-4 mb-2">
              <TabsTrigger value="invoice">Faturação</TabsTrigger>
              <TabsTrigger value="proforma">Proforma</TabsTrigger>
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
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
