"use client";

import {
  DynamicDrawer,
  Button,
  Icon,
  Badge,
  Separator,
} from "@/components";
import { CartItem } from "@/hooks";
import { formatCurrency } from "@/utils";
import { paymentMethodMap } from "@/constants";

interface CheckoutInvoicePreviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  totals: {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
  };
  paymentMethod: string;
  cashGiven?: number;
  change?: number;
  client?: {
    name?: string;
    taxNumber?: string;
    phone?: string;
    address?: string;
  } | null;
  type?: "invoice" | "proforma";
  onConfirm: () => void;
  isPending?: boolean;
}

export function CheckoutInvoicePreviewDrawer({
  open,
  onOpenChange,
  cartItems,
  totals,
  paymentMethod,
  cashGiven,
  change,
  client,
  type = "invoice",
  onConfirm,
  isPending = false,
}: CheckoutInvoicePreviewDrawerProps) {
  const isProforma = type === "proforma";
  const docTitle = isProforma ? "Factura Proforma" : "Factura-Recibo";

  const clientName = client?.name?.trim() || "Consumidor Final";
  const clientNif = client?.taxNumber?.trim() || "999999999";
  const clientPhone = client?.phone?.trim() || "Não informado";
  const clientAddress = client?.address?.trim() || "Não informado";

  const paymentLabel = paymentMethodMap[paymentMethod] || paymentMethod || "Numerário";
  const effectiveChange = Number(change || 0);
  const effectiveCashGiven = Number(cashGiven || 0);

  return (
    <DynamicDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={`Pré-visualização da ${docTitle}`}
      description="Verifique todos os dados do documento e do cliente antes da emissão fiscal"
      className="max-w-2xl"
    >
      <div className="space-y-6 text-sm pb-6">
        {/* Cabeçalho do Documento */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">
                {docTitle}
              </h3>
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/40 bg-primary/5">
                Rascunho POS
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Data: {new Date().toLocaleDateString("pt-AO", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
              {paymentLabel}
            </Badge>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="rounded-xl border bg-muted/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            <Icon name="User" size={13} className="text-primary" />
            <span>Dados do Cliente</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Nome:</span>
              <span className="font-semibold text-foreground">{clientName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">NIF:</span>
              <span className="font-mono font-semibold text-foreground">{clientNif}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Telefone:</span>
              <span className="text-foreground">{clientPhone}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Endereço:</span>
              <span className="text-foreground truncate block" title={clientAddress}>
                {clientAddress}
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Icon name="ShoppingCart" size={13} className="text-primary" />
              <span>Itens da Venda ({cartItems.length})</span>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="bg-muted/60 grid grid-cols-12 gap-2 px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase">
              <span className="col-span-6">Descrição</span>
              <span className="col-span-2 text-center">Qtd</span>
              <span className="col-span-2 text-right">P. Unit</span>
              <span className="col-span-2 text-right">Total</span>
            </div>
            <div className="divide-y max-h-60 overflow-y-auto">
              {cartItems.map((item, index) => {
                const itemQty = Number(item.quantity || 1);
                const itemPrice = Number(item.price || item.unitPrice || 0);
                const itemTotal = itemQty * itemPrice;
                const taxRate =
                  typeof item.tax === "object" && item.tax !== null
                    ? (item.tax as any).rate ?? (item.tax as any).taxPercentage ?? 0
                    : (item.taxRate ?? item.tax ?? 0);
                const taxRateNum = Number(taxRate || 0);

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="grid grid-cols-12 gap-2 px-3 py-2.5 text-xs items-center hover:bg-muted/30 transition-colors"
                  >
                    <div className="col-span-6 flex flex-col">
                      <span className="font-semibold text-foreground line-clamp-1">{String(item.name || "")}</span>
                      {taxRateNum > 0 ? (
                        <span className="text-[10px] text-muted-foreground">IVA: {taxRateNum}%</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Isento de IVA</span>
                      )}
                    </div>
                    <span className="col-span-2 text-center font-mono font-medium">{itemQty}</span>
                    <span className="col-span-2 text-right font-mono text-muted-foreground">
                      {formatCurrency(itemPrice)}
                    </span>
                    <span className="col-span-2 text-right font-mono font-bold text-foreground">
                      {formatCurrency(itemTotal)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resumo dos Totais & Pagamento */}
        <div className="rounded-xl border bg-muted/10 p-4 space-y-2.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtotal (sem impostos):</span>
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(totals.subtotal)}
            </span>
          </div>

          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
              <span>Desconto aplicado:</span>
              <span className="font-mono font-medium">
                -{formatCurrency(totals.discountAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Imposto (IVA):</span>
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(totals.taxAmount)}
            </span>
          </div>

          <Separator className="my-1.5" />

          <div className="flex justify-between text-base font-bold text-foreground">
            <span>Total a Pagar:</span>
            <span className="font-mono text-primary text-lg">
              {formatCurrency(totals.total)}
            </span>
          </div>

          {/* Detalhes de Troco para Dinheiro */}
          {paymentMethod === "CASH" && effectiveCashGiven > 0 && (
            <div className="pt-2 border-t mt-2 space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Valor Entregue:</span>
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(effectiveCashGiven)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Troco a Devolver:</span>
                <span className="font-mono">{formatCurrency(effectiveChange)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex-col-reverse sm:flex-row gap-2.5 pt-2">
            <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Icon name="RefreshCw" size={14} className="mr-1.5 animate-spin" />
                A emitir fatura...
              </>
            ) : (
              <>
                <Icon name="Check" size={14} className="mr-1.5" />
                Confirmar e Emitir
              </>
            )}
          </Button>
        </div>
      </div>
    </DynamicDrawer>
  );
}
