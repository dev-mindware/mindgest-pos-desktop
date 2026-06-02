"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import {
  Card,
  CardContent,
  Button,
  Icon,
  Popover,
  PopoverContent,
  PopoverAnchor,
  Input,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Badge,
} from "@/components";
import { cn } from "@/lib/utils";
import { ErrorMessage, formatCurrency } from "@/utils";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductCard = React.memo<ProductCardProps>(
  ({ product, quantity, onAdd, onRemove, onUpdateQuantity }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editQty, setEditQty] = useState("");

    const handleDoubleClick = () => {
      setEditQty(quantity.toString());
      setIsEditing(true);
    };

    if (!product) return null;

    const handleConfirmQty = () => {
      const qty = parseInt(editQty, 10);
      if (!isNaN(qty) && qty > 0) {
        if (qty <= product.quantity) {
          onUpdateQuantity(product.id, qty);
          setIsEditing(false);
        } else {
          ErrorMessage(`Apenas ${product.quantity} unidades disponíveis.`);
          setEditQty(product.quantity.toString());
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
      <Card className="overflow-hidden flex flex-col h-full bg-[#1F1F1F] rounded-[8px] border-none shadow-none group transition-all duration-300 relative cursor-pointer hover:ring-2 ring-primary/50" onClick={() => {
        if (product.quantity > 0) {
          onAdd(product);
        } else {
          ErrorMessage("Produto sem stock disponível.");
        }
      }}>
        <CardContent className="p-4 flex-1 flex flex-col justify-between h-full relative">
          
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-[8px] bg-[#A855F7]/10 flex items-center justify-center shrink-0">
              <span className="text-[#A855F7] font-bold text-2xl">P</span>
            </div>
            
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="font-bold text-base text-white truncate w-full">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate mb-1">
                {product.description || "Sem descrição"}
              </p>
              
              <div className="flex items-center gap-1.5 mt-auto">
                <div className={cn("w-2 h-2 rounded-full", product.quantity > 0 ? "bg-[#10B981]" : "bg-red-500")} />
                <span className="text-xs text-muted-foreground font-medium">
                  {product.quantity > 0 ? `${product.quantity} unid.` : "Indisponível"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col">
            <p className="text-xs text-muted-foreground truncate mb-1">
              {product.description || "Sem descrição"}
            </p>
            <span className="text-lg font-bold text-white">
              {formatCurrency(product.price || 0)}
            </span>
          </div>

          <button 
            disabled={product.quantity <= 0}
            onClick={(e) => {
              e.stopPropagation();
              if (product.quantity > 0) {
                onAdd(product);
              } else {
                ErrorMessage("Produto sem stock disponível.");
              }
            }}
            className={cn(
              "absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95",
              product.quantity > 0 ? "bg-[#A855F7] text-white hover:bg-[#9333EA]" : "bg-white/10 text-white/50 cursor-not-allowed"
            )}
          >
            <Icon name="Plus" className="w-5 h-5" />
          </button>
        </CardContent>
      </Card>
    );
  }
);

ProductCard.displayName = "ProductCard";
