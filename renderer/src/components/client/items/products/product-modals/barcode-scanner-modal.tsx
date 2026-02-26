"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { Button, GlobalModal, Icon } from "@/components";
import { useModal } from "@/stores/modal/use-modal-store";
import { itemsService } from "@/services/items-service";
import { ErrorMessage } from "@/utils/messages";
import { playScannerBeep } from "@/utils/audio";
import { cn } from "@/lib/utils";

export const BARCODE_SCANNER_MODAL_ID = "barcode-scanner-modal";

export function BarcodeScannerModal() {
  const { open, closeModal, openModal } = useModal();
  const isOpen = open[BARCODE_SCANNER_MODAL_ID] || false;

  const [buffer, setBuffer] = useState("");
  const [isLoading, startTransition] = useTransition();

  const handleCheckBarcode = useCallback(
    (code: string) => {
      if (!code) return;

      startTransition(async () => {
        try {
          const { barcode } = await itemsService.checkBarcode(code);

          if (barcode) {
            ErrorMessage(
              "Já existe um produto cadastrado com esse código de barras na base de dados."
            );
            setBuffer("");
          } else {
            closeModal(BARCODE_SCANNER_MODAL_ID);
            openModal("add-product", { barcode: code });
          }
        } catch (error) {
          ErrorMessage("Ocorreu um erro ao verificar o código de barras.");
          setBuffer("");
        }
      });
    },
    [closeModal, openModal]
  );

  const handleCloseModal = () => {
    closeModal(BARCODE_SCANNER_MODAL_ID);
    setBuffer("");
  };

  useEffect(() => {
    if (!isOpen) {
      setBuffer("");
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;

      // Avoid capturing keys when user is typing in an input inside children if any
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "Enter") {
        if (buffer.length > 0) {
          playScannerBeep();
          handleCheckBarcode(buffer);
        }
      } else if (e.key === "Backspace") {
        setBuffer((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        // Capture alphanumeric characters (barcode can be alphanumeric)
        setBuffer((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, buffer, isLoading, handleCheckBarcode]);

  return (
    <GlobalModal
      id={BARCODE_SCANNER_MODAL_ID}
      className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl"
      title="Leitura de Código de Barras"
      canClose={!isLoading}
    >
      <div className="bg-gradient-to-br from-primary/10 via-background to-background p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-primary/15 flex items-center justify-center text-primary shadow-inner">
              <Icon name="Barcode" size={48} />
            </div>
            {isLoading && (
              <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Aguardando Scanner
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed px-4">
              Aponte o leitor para o código de barras do produto para iniciar o
              cadastro.
            </p>
          </div>

          <div className="w-full py-6 flex flex-col items-center gap-4">
            <div
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/20 text-primary transition-all",
                !isLoading && "animate-bounce-slow"
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full bg-primary",
                  !isLoading && "animate-ping"
                )}
              ></div>
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                {isLoading ? "Verificando..." : "Pronto para ler"}
              </span>
            </div>

            {buffer.length > 0 && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-xl font-mono font-bold tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-lg border border-primary/10">
                  {buffer}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Pressione Enter se o leitor não o fizer
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleCloseModal}>
          Fechar
        </Button>
      </div>
    </GlobalModal>
  );
}
