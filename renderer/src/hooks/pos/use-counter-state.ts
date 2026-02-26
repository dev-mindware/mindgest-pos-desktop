"use client";
import { useState, useEffect } from "react";
import { Product, CartItem, CartType } from "@/types";

interface UseCounterStateProps {
  apiProducts: Product[];
  activeCart: CartType;
}

export function useCounterState({
  apiProducts,
  activeCart,
}: UseCounterStateProps) {
  const [carts, setCarts] = useState<
    Record<CartType, Record<string, CartItem>>
  >({
    invoice: {},
    proforma: {},
  });

  const cartItems = carts[activeCart];

  // Barcode Scanner Logic
  const [barcodeBuffer, setBarcodeBuffer] = useState("");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleGlobalKeyDown = async (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "Enter") {
        if (barcodeBuffer) {
          try {
            const barcode = barcodeBuffer;
            setBarcodeBuffer("");

            const product = apiProducts.find(
              (p) => String(p.barcode) === barcode || p.sku === barcode,
            );

            if (product) {
              setScannedProduct(product);
            }
          } catch (error) {
            console.error("Error finding product:", error);
          }
        }
      } else if (e.key.length === 1) {
        setBarcodeBuffer((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [barcodeBuffer, apiProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (barcodeBuffer) {
        setBarcodeBuffer("");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [barcodeBuffer]);

  const onConfirmScan = () => {
    if (scannedProduct) {
      handleAddToCart(scannedProduct);
      setScannedProduct(null);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCarts((prev) => {
      const currentCart = prev[activeCart];
      const existingItem = currentCart[product.id];

      if (existingItem) {
        const newQty = existingItem.qty + 1;
        const updatedCart = {
          ...currentCart,
          [product.id]: { ...existingItem, qty: newQty },
        };
        return { ...prev, [activeCart]: updatedCart };
      } else {
        const newItem: CartItem = {
          ...product,
          qty: 1,
        };
        return {
          ...prev,
          [activeCart]: { ...currentCart, [product.id]: newItem },
        };
      }
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCarts((prev) => {
      const currentCart = prev[activeCart];
      const existingItem = currentCart[productId];

      if (!existingItem) return prev;

      const newQty = existingItem.qty - 1;

      if (newQty <= 0) {
        const { [productId]: _, ...rest } = currentCart;
        return { ...prev, [activeCart]: rest };
      } else {
        const updatedCart = {
          ...currentCart,
          [productId]: { ...existingItem, qty: newQty },
        };
        return { ...prev, [activeCart]: updatedCart };
      }
    });
  };

  const handleDeleteItem = (productId: string) => {
    setCarts((prev) => {
      const { [productId]: _, ...rest } = prev[activeCart];
      return { ...prev, [activeCart]: rest };
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleDeleteItem(productId);
      return;
    }

    setCarts((prev) => {
      const currentCart = prev[activeCart];
      const existingItem = currentCart[productId];

      if (!existingItem) return prev;

      return {
        ...prev,
        [activeCart]: {
          ...currentCart,
          [productId]: { ...existingItem, qty: quantity },
        },
      };
    });
  };

  const handleClearCart = (type: CartType) => {
    setCarts((prev) => ({
      ...prev,
      [type]: {},
    }));
  };

  const getCartItemsArray = (type: CartType): CartItem[] => {
    const items = carts[type];
    return Object.values(items);
  };

  return {
    carts,
    cartItems,
    barcodeBuffer,
    scannedProduct,
    onConfirmScan,
    handleAddToCart,
    handleRemoveFromCart,
    handleDeleteItem,
    handleUpdateQuantity,
    handleClearCart,
    getCartItemsArray,
  };
}
