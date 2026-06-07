"use client";

import React, { useState } from "react";
import { Icon, Avatar, AvatarFallback, AvatarImage, Popover, PopoverContent, PopoverAnchor, Input, Button } from "@/components";
import { Product } from "@/types";
import { CartCheckoutForm } from "./checkout-form";
import { formatCurrency, ErrorMessage } from "@/utils";

interface CartItem extends Product {
    qty: number;
}

interface CartSectionProps {
    cartItems: CartItem[];
    onUpdateQty: (item: CartItem, delta: number) => void;
    onRemove: (itemId: string) => void;
    onDelete: (itemId: string) => void;
    onClearCart: () => void;
    type?: "invoice" | "proforma";
    cashSessionId: string;
    checkout: any;
}

const CartItemRow = React.memo<{
    item: CartItem;
    onDelete: (id: string) => void;
    onUpdateQty: (item: CartItem, delta: number) => void;
}>(({ item, onDelete, onUpdateQty }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editQty, setEditQty] = useState("");

    const handleDoubleClick = () => {
        setEditQty(item.qty.toString());
        setIsEditing(true);
    };

    const handleConfirmQty = () => {
        const qty = parseInt(editQty, 10);
        if (!isNaN(qty) && qty > 0) {
            if (qty <= item.quantity) {
                onUpdateQty(item, qty - item.qty);
                setIsEditing(false);
            } else {
                ErrorMessage(`Apenas ${item.quantity} unidades disponíveis.`);
                setEditQty(item.qty.toString());
            }
        } else {
            ErrorMessage("Quantidade inválida.");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleConfirmQty();
        }
    };

    return (
    <div key={item.id} className="relative flex flex-col p-4 border-b border-border dark:border-white/5 hover:bg-muted/30 dark:hover:bg-white/[0.02] transition-colors group">
        <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
                <span className="font-bold text-foreground text-sm">{item.name}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{item.qty}x</span>
                <span className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[150px]">{item.description || "Sem descrição"}</span>
            </div>
            <div className="flex flex-col items-end pr-5">
                <span className="font-medium text-sm text-foreground">{formatCurrency((item.price || 0) * item.qty)}</span>
            </div>
        </div>

        <button
            onClick={() => onDelete(item.id)}
            className="absolute top-3 right-3 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 p-1 rounded-full transition-all"
            title="Remover"
        >
            <Icon name="X" size={14} />
        </button>

        <div className="absolute bottom-3 right-3 flex items-center bg-muted dark:bg-[#2A2A2A] rounded-full border border-border dark:border-white/10 px-1 overflow-hidden h-8">
            <button 
                onClick={() => onUpdateQty(item, -1)}
                className="w-7 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/20 dark:hover:bg-white/10"
            >
                <Icon name="Minus" size={14} />
            </button>
            <Popover open={isEditing} onOpenChange={setIsEditing}>
                <PopoverAnchor asChild>
                    <span 
                        className="text-sm font-bold w-6 text-center text-foreground select-none cursor-pointer hover:text-primary transition-colors"
                        onDoubleClick={handleDoubleClick}
                        title="Duplo clique para editar"
                    >
                        {item.qty}
                    </span>
                </PopoverAnchor>
                <PopoverContent
                    className="w-auto p-3 shadow-2xl border-primary/20 backdrop-blur-md z-110"
                    align="end"
                    side="top"
                    onInteractOutside={(e: any) => {
                      const target = e.target as HTMLElement;
                      if (target?.closest("#virtual-keyboard")) {
                        e.preventDefault();
                      }
                    }}
                >
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Quantidade
                        </span>
                        <div className="flex items-center gap-2">
                            <Input
                                value={editQty}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditQty(e.target.value)}
                                className="h-8 w-16 text-center text-sm font-bold focus-visible:ring-primary/30"
                                type="number"
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                            <Button
                                size="icon"
                                className="h-8 w-8 shrink-0 bg-primary hover:bg-primary/90"
                                onClick={handleConfirmQty}
                            >
                                <Icon name="Check" className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <button 
                onClick={() => onUpdateQty(item, 1)}
                className="w-7 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/20 dark:hover:bg-white/10"
            >
                <Icon name="Plus" size={14} />
            </button>
        </div>
    </div>
    );
});

CartItemRow.displayName = "CartItemRow";

export const CartList = React.memo<CartSectionProps>(
    ({
        cartItems,
        onUpdateQty,
        onRemove,
        onDelete,
        onClearCart,
        type = "invoice",
        cashSessionId,
        checkout,
    }) => {
        return (
            /* CartCheckoutForm aligned to Control Panel height (35% of viewport) */
           <div className="grid grid-rows-[62.5%_37.5%] h-full w-full bg-background dark:bg-[#121212] overflow-hidden">
                
                {/* Parte 1: Itens do Carrinho (62.5%) */}
                <div className="h-full w-full min-h-0 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col">
                        {cartItems.map((item) => (
                            <CartItemRow
                                key={item.id}
                                item={item}
                                onDelete={onDelete}
                                onUpdateQty={onUpdateQty}
                            />
                        ))}
                        {cartItems.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30 gap-3">
                                <Icon name="ShoppingBasket" size={48} />
                                <span className="text-sm font-medium">Carrinho vazio</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Parte 2: Checkout Form (37.5%) */}
                <div className="h-full w-full min-h-0 overflow-y-auto border-t border-border dark:border-white/10 bg-background dark:bg-[#161616]">
                    <CartCheckoutForm
                        cartItems={cartItems}
                        type={type}
                        cashSessionId={cashSessionId}
                        onSuccess={onClearCart}
                        checkout={checkout}
                    />
                </div>
            </div>
        );
    }
);

CartList.displayName = "CartList";