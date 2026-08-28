"use client";

import { useEffect, useCallback } from "react";

export interface CounterHotkeysHandlers {
  onOpenHelp?: () => void;
  onFocusSearch?: () => void;
  onSelectClient?: () => void;
  onCheckout?: () => void;
  onQuickCash?: () => void;
  onHoldCart?: () => void;
  onOpenDrawer?: () => void;
  onClearCart?: () => void;
  onToggleKeyboard?: () => void;
  onDeleteItem?: () => void;
  onIncreaseQty?: () => void;
  onDecreaseQty?: () => void;
  onEscape?: () => void;
  disabled?: boolean;
}

export function useCounterHotkeys({
  onOpenHelp,
  onFocusSearch,
  onSelectClient,
  onCheckout,
  onQuickCash,
  onHoldCart,
  onOpenDrawer,
  onClearCart,
  onToggleKeyboard,
  onDeleteItem,
  onIncreaseQty,
  onDecreaseQty,
  onEscape,
  disabled = false,
}: CounterHotkeysHandlers) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;

      const activeElement = document.activeElement as HTMLElement | null;
      const isInput =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable);

      // Bloquear teclas reservadas do navegador/Electron
      if (
        e.key === "F1" ||
        e.key === "F5" ||
        e.key === "F11" ||
        (process.env.NODE_ENV === "production" && e.key === "F12")
      ) {
        e.preventDefault();
      }

      // Atalhos funcionais globais (F1-F10 e Escape funcionam mesmo quando dentro de inputs)
      switch (e.key) {
        case "F1":
          e.preventDefault();
          onOpenHelp?.();
          return;

        case "F2":
          e.preventDefault();
          onFocusSearch?.();
          return;

        case "F3":
          e.preventDefault();
          onSelectClient?.();
          return;

        case "F4":
          e.preventDefault();
          onCheckout?.();
          return;

        case "F5":
          e.preventDefault();
          onQuickCash?.();
          return;

        case "F7":
          e.preventDefault();
          onToggleKeyboard?.();
          return;

        case "F8":
          e.preventDefault();
          onHoldCart?.();
          return;

        case "F9":
          e.preventDefault();
          onOpenDrawer?.();
          return;

        case "F10":
          e.preventDefault();
          onClearCart?.();
          return;

        case "Escape":
          e.preventDefault();
          onEscape?.();
          return;
      }

      // Atalhos de operação de itens (não disparam se estiver digitando em campo de texto)
      if (isInput) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDeleteItem?.();
      } else if (e.key === "+" || e.code === "NumpadAdd") {
        e.preventDefault();
        onIncreaseQty?.();
      } else if (e.key === "-" || e.code === "NumpadSubtract") {
        e.preventDefault();
        onDecreaseQty?.();
      }
    },
    [
      disabled,
      onOpenHelp,
      onFocusSearch,
      onSelectClient,
      onCheckout,
      onQuickCash,
      onHoldCart,
      onOpenDrawer,
      onClearCart,
      onDeleteItem,
      onIncreaseQty,
      onDecreaseQty,
      onEscape,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
