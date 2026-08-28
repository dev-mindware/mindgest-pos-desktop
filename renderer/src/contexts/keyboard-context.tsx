"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useWorkspaceStore } from "@/stores/pos/workspace-store";

// Define the shape of our context
interface KeyboardContextType {
  isVisible: boolean;
  layout: "default" | "numeric" | "accent";
  isShift: boolean;
  isCaps: boolean;
  activeInput: HTMLInputElement | HTMLTextAreaElement | null;
  openKeyboard: (input?: HTMLInputElement | HTMLTextAreaElement) => void;
  closeKeyboard: () => void;
  toggleKeyboard: () => void;
  handleKeyPress: (key: string) => void;
  toggleShift: () => void;
  toggleCaps: () => void;
  setLayout: (layout: "default" | "numeric" | "accent") => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined
);

export function KeyboardProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeInput, setActiveInput] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);
  const [layout, setLayout] = useState<"default" | "numeric" | "accent">(
    "default"
  );
  const [isShift, setIsShift] = useState(false);
  const [isCaps, setIsCaps] = useState(false);
  const lastInteractedInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const { enableVirtualKeyboard } = useWorkspaceStore();

  // Detetar cliques e focos em inputs para acionar o teclado virtual
  useEffect(() => {
    if (!enableVirtualKeyboard) return;

    const handleFocusOrClick = (e: Event) => {
      const target = e.target as HTMLElement;

      if (
        (target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement) &&
        !target.dataset.noKeyboard &&
        !target.readOnly &&
        !target.disabled
      ) {
        const input = target as HTMLInputElement;
        const type = input.type;
        const inputMode = input.inputMode;
        const dataLayout = input.getAttribute("data-layout");

        // Deteção inteligente de layout numérico
        const isNumeric =
          type === "number" ||
          type === "tel" ||
          inputMode === "numeric" ||
          dataLayout === "numeric";

        lastInteractedInputRef.current = target as HTMLInputElement | HTMLTextAreaElement;
        setLayout(isNumeric ? "numeric" : "default");
        setActiveInput(target as HTMLInputElement | HTMLTextAreaElement);
        setIsVisible(true);
      }
    };

    document.addEventListener("focusin", handleFocusOrClick);
    document.addEventListener("click", handleFocusOrClick, true);

    return () => {
      document.removeEventListener("focusin", handleFocusOrClick);
      document.removeEventListener("click", handleFocusOrClick, true);
    };
  }, [enableVirtualKeyboard]);

  // Sincronização segura do layout com o input ativo
  useEffect(() => {
    if (!activeInput) return;
    const input = activeInput;
    const type = input.type;
    const inputMode = input.inputMode;
    const dataLayout = input.getAttribute("data-layout");

    const isNumeric =
      type === "number" ||
      type === "tel" ||
      inputMode === "numeric" ||
      dataLayout === "numeric";
    const targetLayout = isNumeric ? "numeric" : "default";

    if (layout !== "accent" && layout !== targetLayout) {
      setLayout(targetLayout);
    }
  }, [activeInput, layout]);

  const openKeyboard = useCallback(
    (input?: HTMLInputElement | HTMLTextAreaElement) => {
      if (input) {
        setActiveInput(input);
        lastInteractedInputRef.current = input;
      } else if (lastInteractedInputRef.current) {
        setActiveInput(lastInteractedInputRef.current);
      }
      setIsVisible(true);
    },
    []
  );

  const closeKeyboard = useCallback(() => {
    setIsVisible(false);
    setActiveInput(null);
  }, []);

  const toggleKeyboard = useCallback(() => {
    setIsVisible((prev) => {
      if (!prev && !activeInput && lastInteractedInputRef.current) {
        setActiveInput(lastInteractedInputRef.current);
      }
      return !prev;
    });
  }, [activeInput]);

  useEffect(() => {
    if (!enableVirtualKeyboard && isVisible) {
      closeKeyboard();
    }
  }, [enableVirtualKeyboard, isVisible, closeKeyboard]);

  const toggleShift = useCallback(() => setIsShift((prev) => !prev), []);
  const toggleCaps = useCallback(() => setIsCaps((prev) => !prev), []);

  const handleKeyPress = useCallback(
    (key: string) => {
      const targetInput = activeInput || lastInteractedInputRef.current;
      if (!targetInput) return;

      const input = targetInput;
      const currentVal = input.value;
      const start = input.selectionStart ?? currentVal.length;
      const end = input.selectionEnd ?? currentVal.length;

      let charToInsert = key;
      let isSpecialAction = false;

      if (key === "{bksp}") {
        isSpecialAction = true;
        let nextVal = currentVal;
        let nextCursor = start;
        if (start === end) {
          if (start > 0) {
            nextVal =
              currentVal.substring(0, start - 1) + currentVal.substring(end);
            nextCursor = start - 1;
          }
        } else {
          nextVal = currentVal.substring(0, start) + currentVal.substring(end);
          nextCursor = start;
        }
        updateInputValue(input, nextVal, nextCursor);
      } else if (key === "{space}") {
        charToInsert = " ";
      } else if (key === "{enter}") {
        isSpecialAction = true;
        const event = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          bubbles: true,
          cancelable: true,
        });
        input.dispatchEvent(event);

        if (input instanceof HTMLTextAreaElement && !event.defaultPrevented) {
          const nextVal =
            currentVal.substring(0, start) + "\n" + currentVal.substring(end);
          updateInputValue(input, nextVal, start + 1);
        } else {
          closeKeyboard();
        }
      } else if (key === "{shift}") {
        toggleShift();
        isSpecialAction = true;
      } else if (key === "{caps}") {
        toggleCaps();
        isSpecialAction = true;
      } else if (key === "00") {
        charToInsert = "00";
      }

      if (!isSpecialAction) {
        let finalKey = charToInsert;
        if (
          charToInsert.length === 1 &&
          /[a-z\u00C0-\u00FF]/i.test(charToInsert)
        ) {
          const wantUpper = isCaps !== isShift;
          finalKey = wantUpper
            ? charToInsert.toUpperCase()
            : charToInsert.toLowerCase();
        }

        const nextVal =
          currentVal.substring(0, start) + finalKey + currentVal.substring(end);
        const nextCursor = start + finalKey.length;
        updateInputValue(input, nextVal, nextCursor);

        if (isShift) setIsShift(false);
      }
    },
    [activeInput, isCaps, isShift, toggleShift, toggleCaps, closeKeyboard]
  );

  const updateInputValue = (
    input: HTMLInputElement | HTMLTextAreaElement,
    nextVal: string,
    nextCursor: number
  ) => {
    const proto =
      input instanceof HTMLInputElement
        ? HTMLInputElement.prototype
        : HTMLTextAreaElement.prototype;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      proto,
      "value"
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, nextVal);
    } else {
      input.value = nextVal;
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    requestAnimationFrame(() => {
      try {
        input.focus({ preventScroll: true });
        const isSelectionSupported = input.selectionStart !== null;
        if (
          isSelectionSupported &&
          typeof input.setSelectionRange === "function"
        ) {
          input.setSelectionRange(nextCursor, nextCursor);
        }
      } catch {}
    });
  };

  return (
    <KeyboardContext.Provider
      value={{
        isVisible,
        layout,
        isShift,
        isCaps,
        activeInput,
        openKeyboard,
        closeKeyboard,
        toggleKeyboard,
        handleKeyPress,
        toggleShift,
        toggleCaps,
        setLayout,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (context === undefined) {
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  }
  return context;
}
