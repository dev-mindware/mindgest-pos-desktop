"use client";

import React from "react";
import { Icon, Avatar, AvatarFallback, AvatarImage } from "@/components";
import { Product } from "@/types";
import { CartCheckoutForm } from "./checkout-form";

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
}

const CartItemRow = React.memo<{
    item: CartItem;
    onDelete: (id: string) => void;
    onUpdateQty: (item: CartItem, delta: number) => void;
}>(({ item, onDelete, onUpdateQty }) => (
    <div key={item.id} className="relative flex flex-col p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
        <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
                <span className="font-bold text-white text-sm">{item.name}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{item.qty}x</span>
                <span className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[150px]">{item.description || "Sem descrição"}</span>
            </div>
            <div className="flex flex-col items-end pr-5">
                <span className="font-medium text-sm text-white">{formatCurrency((item.price || 0) * item.qty)}</span>
            </div>
        </div>

        <button
            onClick={() => onDelete(item.id)}
            className="absolute top-3 right-3 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 p-1 rounded-full transition-all"
            title="Remover"
        >
            <Icon name="X" size={14} />
        </button>

        <div className="absolute bottom-3 right-3 flex items-center bg-[#2A2A2A] rounded-full border border-white/10 px-1 overflow-hidden h-8">
            <button 
                onClick={() => onUpdateQty(item, -1)}
                className="w-7 h-full flex items-center justify-center text-white/70 hover:text-white transition-colors hover:bg-white/5"
            >
                <Icon name="Minus" size={14} />
            </button>
            <span className="text-sm font-bold w-6 text-center text-white select-none">{item.qty}</span>
            <button 
                onClick={() => onUpdateQty(item, 1)}
                className="w-7 h-full flex items-center justify-center text-white/70 hover:text-white transition-colors hover:bg-white/5"
            >
                <Icon name="Plus" size={14} />
            </button>
        </div>
    </div>
));

CartItemRow.displayName = "CartItemRow";

import { formatCurrency } from "@/utils";

export const CartList = React.memo<CartSectionProps>(
    ({
        cartItems,
        onUpdateQty,
        onRemove,
        onDelete,
        onClearCart,
        type = "invoice",
        cashSessionId,
    }) => {
        return (
            <div className="flex flex-col bg-[#121212] flex-1">
                {/* Cart Items List */}
                <div className="flex-1 min-h-0 relative">
                    <div className="h-full overflow-y-auto custom-scrollbar">
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
                </div>


                {/* Sub-components for checkout summary and payment methods */}
                <CartCheckoutForm
                    cartItems={cartItems}
                    type={type}
                    cashSessionId={cashSessionId}
                    onSuccess={onClearCart}
                />
            </div>
        );
    }
);

CartList.displayName = "CartList";