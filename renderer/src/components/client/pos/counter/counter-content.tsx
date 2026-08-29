"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CategorySelector, ProductList } from "./products";
import { CartList } from "./cart";
import {
  BarcodeProductScanner,
  ShortcutsHelpModal,
} from "./modals";
import { currentStoreStore, useAuthStore, useModal } from "@/stores";
import { useGetCategories, useGetItems, useGetCurrentSession } from "@/hooks";
import { useQueryState } from "nuqs";
import {
  PosCategorySkeleton,
  PosProductSectionSkeleton,
  PosCartSkeleton,
  Tabs, TabsContent, TabsList, TabsTrigger,
  ScrollArea,
  Button
} from "@/components";
import { Product, CartType, CartItem as TypeCartItem } from "@/types";
import { useCounterState, useIsMobile } from "@/hooks";
import { useGetProductCountsByCategory } from "@/hooks/stock/use-items";
import { useCounterHotkeys } from "@/hooks/pos/use-counter-hotkeys";
import { SucessMessage, ErrorMessage, WarningMessage } from "@/utils/messages";
import { Keyboard, KeyRound, Tv } from "lucide-react";
import { MobilePosLayout } from "../mobile";
import { ManagerAuthModal, MODAL_MANAGER_AUTH_ID } from "../manager-auth-modal";
import { useKeyboard } from "@/contexts/keyboard-context";
import { useWorkspaceStore } from "@/stores/pos/workspace-store";

export function CounterContent() {
  const { toggleKeyboard, isVisible: isKeyboardVisible } = useKeyboard();
  const { enableVirtualKeyboard } = useWorkspaceStore();
  const [search] = useQueryState("search", { defaultValue: "" });
  const { categories, isLoading: isLoadingCategories } = useGetCategories();
  const {
    data: productCountsByCategory = {},
    isLoading: isLoadingProductCounts,
  } = useGetProductCountsByCategory();

  const availableCategories = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          itemsCount: productCountsByCategory[category.id] ?? 0,
        }))
        .filter((category) => category.itemsCount > 0)
        .sort((a, b) => b.itemsCount - a.itemsCount),
    [categories, productCountsByCategory],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (availableCategories.length === 0) {
      setSelectedCategory("");
      return;
    }

    const selectedCategoryIsAvailable = availableCategories.some(
      (category) => category.id === selectedCategory,
    );

    if (!selectedCategoryIsAvailable) {
      setSelectedCategory(availableCategories[0].id);
    }
  }, [availableCategories, selectedCategory]);

  const { items: apiProducts, isLoading: isLoadingProducts } = useGetItems({
    search: search || undefined,
    categoryId: selectedCategory || undefined,
    type: "PRODUCT",
    limit: 100,
  });

  const { currentStore } = currentStoreStore();
  const { data: currentSession } = useGetCurrentSession(currentStore?.id);

  const [activeCart, setActiveCart] = useState<CartType>("invoice");
  const { openModal } = useModal();

  const {
    scannedProduct,
    onConfirmScan,
    handleAddToCart,
    handleRemoveFromCart,
    handleDeleteItem,
    handleUpdateQuantity,
    handleClearCart,
    getCartItemsArray,
    findProductByBarcode,
    handleManualScan,
  } = useCounterState({ apiProducts, activeCart });

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { user } = useAuthStore();

  const executeOpenDrawer = useCallback(async (reason: string) => {
    try {
      if (typeof window !== "undefined" && window.ipc?.printer?.openCashDrawer) {
        const res = await window.ipc.printer.openCashDrawer({
          options: { transport: "spooler" },
          auditEntry: {
            sessionId: currentSession?.id,
            userId: user?.id,
            storeId: currentStore?.id,
            type: "MANUAL",
            reason: `Abertura manual (${reason})`,
          },
        });
        if (res?.success) {
          SucessMessage("Gaveta de dinheiro acionada!");
        } else {
          ErrorMessage(res?.message || "Não foi possível abrir a gaveta.");
        }
      }
    } catch (err: any) {
      ErrorMessage("Erro ao comunicar com a impressora/gaveta.");
    }
  }, [currentSession?.id, user?.id, currentStore?.id]);

  const handleOpenDrawer = useCallback(async () => {
    const isManagerOrOwner =
      user?.role === "OWNER" ||
      user?.role === "MANAGER" ||
      user?.role === "ADMIN";

    if (isManagerOrOwner) {
      await executeOpenDrawer(`Autorizado por ${user?.role}`);
    } else {
      openModal(MODAL_MANAGER_AUTH_ID);
    }
  }, [user?.role, executeOpenDrawer, openModal]);

  const activeCartItems = useMemo(() => getCartItemsArray(activeCart), [activeCart, getCartItemsArray]);

  const handleHotkeysDelete = useCallback(() => {
    if (activeCartItems.length > 0) {
      const lastItem = activeCartItems[activeCartItems.length - 1];
      handleRemoveFromCart(lastItem.id);
    }
  }, [activeCartItems, handleRemoveFromCart]);

  const handleHotkeysInc = useCallback(() => {
    if (activeCartItems.length > 0) {
      const lastItem = activeCartItems[activeCartItems.length - 1];
      handleUpdateQuantity(lastItem.id, lastItem.qty + 1);
    }
  }, [activeCartItems, handleUpdateQuantity]);

  const handleHotkeysDec = useCallback(() => {
    if (activeCartItems.length > 0) {
      const lastItem = activeCartItems[activeCartItems.length - 1];
      if (lastItem.qty > 1) {
        handleUpdateQuantity(lastItem.id, lastItem.qty - 1);
      } else {
        handleRemoveFromCart(lastItem.id);
      }
    }
  }, [activeCartItems, handleUpdateQuantity, handleRemoveFromCart]);

  const handleFocusSearch = useCallback(() => {
    const searchInput = document.querySelector('input[placeholder*="buscar"], input[placeholder*="Buscar"], input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }, []);

  // Sincronização em tempo real com o Ecrã de Cliente (Debounce 100ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.ipc?.customerDisplay?.update) {
        if (activeCartItems.length === 0) {
          void window.ipc.customerDisplay.clear(currentStore?.name);
        } else {
          const subtotal = activeCartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0);
          void window.ipc.customerDisplay.update({
            status: "scanning",
            items: activeCartItems.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              qty: item.qty,
              total: (item.price || 0) * (item.qty || 1),
              image: item.image,
            })),
            subtotal,
            tax: 0,
            discount: 0,
            total: subtotal,
            storeName: currentStore?.name || "Mindgest POS",
          });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeCartItems, currentStore?.name]);

  // Alerta de monitor secundário desconectado
  useEffect(() => {
    if (typeof window !== "undefined" && window.ipc?.customerDisplay?.onHardwareChange) {
      const unsub = window.ipc.customerDisplay.onHardwareChange(({ event }) => {
        if (event === "removed") {
          WarningMessage("Monitor secundário de cliente desconectado.");
        } else {
          SucessMessage("Novo monitor detectado no sistema!");
        }
      });
      return () => unsub?.();
    }
  }, []);

  useCounterHotkeys({
    onOpenHelp: () => setIsHelpOpen(true),
    onFocusSearch: handleFocusSearch,
    onClearCart: () => handleClearCart(activeCart),
    onToggleKeyboard: toggleKeyboard,
    onDeleteItem: handleHotkeysDelete,
    onIncreaseQty: handleHotkeysInc,
    onDecreaseQty: handleHotkeysDec,
    onEscape: () => setIsHelpOpen(false),
    disabled: isHelpOpen,
  });

  const handleToggleCustomerDisplay = useCallback(async () => {
    if (typeof window !== "undefined" && window.ipc?.customerDisplay?.toggle) {
      const isOpen = await window.ipc.customerDisplay.toggle();
      if (isOpen) {
        SucessMessage("Ecrã de cliente aberto no monitor secundário!");
      } else {
        SucessMessage("Ecrã de cliente fechado.");
      }
    }
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const currentCategoryName = useMemo(() =>
    availableCategories.find((c) => c.id === selectedCategory)?.name
    , [availableCategories, selectedCategory]);

  const products: Product[] = useMemo(() =>
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
      tax: p.tax,
    })), [apiProducts]);

  const cartItemsMap = useMemo(() =>
    getCartItemsArray(activeCart).reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as Record<string, any>)
    , [activeCart, getCartItemsArray]);

  const isMobile = useIsMobile();

  const handleUpdateQtyInvoice = useCallback((item: any, delta: number) =>
    handleUpdateQuantity(item.id, item.qty + delta)
    , [handleUpdateQuantity]);

  const handleUpdateQtyProforma = useCallback((item: any, delta: number) =>
    handleUpdateQuantity(item.id, item.qty + delta)
    , [handleUpdateQuantity]);

  const handleClearCartInvoice = useCallback(() => handleClearCart("invoice"), [handleClearCart]);
  const handleClearCartProforma = useCallback(() => handleClearCart("proforma"), [handleClearCart]);

  if (isMobile) {
    return (
      <MobilePosLayout
        products={products}
        categories={availableCategories}
        cartItems={getCartItemsArray(activeCart)}
        onAddToCart={handleAddToCart}
        onUpdateQty={(item: TypeCartItem, delta: number) => handleUpdateQuantity(item.id, item.qty + delta)}
        onRemove={handleRemoveFromCart}
        onProcessTransaction={() => {
            // Logic to open checkout drawer/modal for mobile
        }}
        onScan={handleManualScan}
        onResolveScan={findProductByBarcode}
        activeCategory={selectedCategory}
        onCategoryChange={handleCategorySelect}
        isLoading={
          isLoadingCategories || isLoadingProductCounts || isLoadingProducts
        }
        cashSessionId={currentSession?.id || ""}
      />
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      <ShortcutsHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ManagerAuthModal onAuthenticated={() => executeOpenDrawer("Autorizado por Gerente")} />
      <BarcodeProductScanner
        scannedProduct={scannedProduct}
        onConfirm={onConfirmScan}
      />
      <div className="flex-1 flex flex-col min-w-0 gap-4 p-4">
        {isLoadingCategories || isLoadingProductCounts ? (
          <PosCategorySkeleton />
        ) : (
          <CategorySelector
            categories={availableCategories}
            activeCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {currentCategoryName || "Todos"}
          </h2>
          <div className="flex items-center gap-2">
            {enableVirtualKeyboard && (
              <Button
                variant={isKeyboardVisible ? "secondary" : "outline"}
                size="sm"
                onClick={toggleKeyboard}
                className={`h-8 gap-1.5 text-xs transition-all duration-200 cursor-pointer ${
                  isKeyboardVisible
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-soft-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Teclado Virtual no Ecrã (F7)"
              >
                <Keyboard className={`w-3.5 h-3.5 ${isKeyboardVisible ? "text-primary animate-pulse" : "text-emerald-500"}`} />
                <span className="hidden sm:inline">Teclado</span>
                <kbd className="px-1 text-[10px] font-mono bg-muted/80 border border-border/80 rounded-[2px]">F7</kbd>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleCustomerDisplay}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              title="Abrir/Fechar Ecrã de Cliente no 2º Monitor"
            >
              <Tv className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Ecrã Cliente</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenDrawer}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              title="Abrir Gaveta de Dinheiro (F9 - Requer Gerente para caixas)"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Gaveta</span>
              <kbd className="px-1 text-[10px] font-mono bg-muted border border-border">F9</kbd>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHelpOpen(true)}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              title="Mapa de Atalhos (F1)"
            >
              <Keyboard className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Atalhos</span>
              <kbd className="px-1 text-[10px] font-mono bg-muted border border-border">F1</kbd>
            </Button>
          </div>
        </div>

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

      {/* Right Content - Cart & Payment */}
      <div className="w-[320px] sm:w-[350px] md:w-[370px] lg:w-[390px] xl:w-[420px] shrink-0 flex flex-col border-l border-border/50 bg-sidebar/30 h-full overflow-y-auto custom-scrollbar">
        <Tabs value={activeCart} onValueChange={(v) => setActiveCart(v as CartType)} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-auto grid-cols-2 m-4 mb-2 shrink-0" data-tour="pos-document-tabs">
            <TabsTrigger value="invoice">Facturação</TabsTrigger>
            <TabsTrigger value="proforma" data-tour="pos-document-tab-proforma">Proforma</TabsTrigger>
          </TabsList>

          <TabsContent value="invoice" className="flex-1 mt-0 flex flex-col min-h-0">
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

          <TabsContent value="proforma" className="flex-1 mt-0 flex flex-col min-h-0">
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
