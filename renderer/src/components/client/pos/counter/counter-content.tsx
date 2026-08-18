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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Button,
  Icon,
} from "@/components";
import {
  useCounterState,
  useRecommendations,
  useMindPricingConfig,
} from "@/hooks";
import { Sparkles } from "lucide-react";
import { CartType, Product } from "@/types";

export function CounterContent() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search || "");
  const { categories, isLoading: isLoadingCategories } = useGetCategories();
  const [activeCart, setActiveCart] = useState<CartType>("invoice");

  // Resizable cart width state
  const [cartWidth, setCartWidth] = useState<number>(400);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - mouseMoveEvent.clientX;
      if (newWidth >= 320 && newWidth <= 600) {
        setCartWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);
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

  return (
    <div className="flex w-full h-full overflow-hidden min-h-0 select-none" style={{ cursor: isResizing ? 'col-resize' : 'default' }}>
      {/* Left Section - Product List and Categories */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden p-4 gap-4 select-text">
        <BarcodeProductScanner
          scannedProduct={scannedProduct}
          onConfirm={onConfirmScan}
        />
        <div className="sticky top-0 z-20 bg-background dark:bg-[#121212]">
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

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {currentCategoryName || "Todos"}
          </h2>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-2">
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
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className={`w-1 cursor-col-resize h-full shrink-0 relative z-30 flex items-center justify-center group transition-colors ${
          isResizing ? "bg-primary/50" : "hover:bg-primary/30"
        }`}
        onMouseDown={startResizing}
      >
        <div className={`w-[1px] h-full transition-colors ${
          isResizing ? "bg-primary" : "bg-border dark:bg-white/10 group-hover:bg-primary/50"
        }`} />
      </div>

      {/* Right Content - Cart & Payment */}
      <div 
        style={{ width: `${cartWidth}px` }} 
        className="shrink-0 h-full flex flex-col bg-sidebar/30 select-text"
      >
        <Tabs
          value={activeCart}
          onValueChange={(v) => setActiveCart(v as CartType)}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 pb-0 gap-2">
            <TabsList className="grid w-full grid-cols-2 m-0" data-tour="pos-document-tabs">
              <TabsTrigger value="invoice" className="cursor-pointer">
                Faturação
              </TabsTrigger>
              <TabsTrigger value="proforma" className="cursor-pointer" data-tour="pos-document-tab-proforma">
                Proforma
              </TabsTrigger>
            </TabsList>

            {/* Mind AI Recommendations Tooltip */}
            {currentCartArray.length > 0 && (
              <div className="shrink-0 flex items-center">
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

          <TabsContent
            value="invoice"
            className="flex-1 mt-0 min-h-0 data-[state=active]:block overflow-y-auto"
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
            className="flex-1 mt-0 min-h-0 data-[state=active]:block overflow-y-auto"
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

