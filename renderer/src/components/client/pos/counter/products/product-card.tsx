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
      <Card 
        className="overflow-hidden max-w-[250px] w-full flex flex-col py-0 relative group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm cursor-pointer"
        onClick={() => {
          if (quantity === 0 && product.quantity > 0) {
            onAdd(product);
          }
        }}
      >
        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col gap-3">
          {/* Top Content: Image & Title */}
          <div className="flex gap-3 sm:gap-3.5">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 rounded-test-xl shrink-0 border border-border/50 shadow-inner">
              <AvatarImage src={product.image} className="object-cover" />
              <AvatarFallback className="rounded-test-xl bg-primary/10 text-primary font-bold text-lg">
                {product.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col justify-between py-0.5 sm:py-1 flex-1 overflow-hidden cursor-help">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-bold text-xs sm:text-sm leading-tight line-clamp-2 text-foreground/90 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handlerEditProduct(product as any);
                      }}
                    >
                      <Icon name="Pencil" className="h-3 w-3" />
                    </Button> */}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight truncate mt-0.5">
                    {product.description || "Sem descrição"}
                  </p>
                  <div className="pt-1.5 flex flex-wrap gap-1">
                    {product.quantity > 0 ? (
                      <Badge
                        variant="secondary"
                        className="text-[10px] items-center gap-1.5 px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 transition-colors font-medium shadow-sm"
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-test-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-test-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        {product?.quantity} unid.
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="text-[10px] items-center gap-1.5 px-2 py-0.5 border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/15 transition-colors cursor-not-allowed font-medium shadow-sm"
                      >
                        <div className="h-1.5 w-1.5 rounded-test-full bg-red-500" />
                        Indisponível
                      </Badge>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="start"
                className="max-w-[220px] p-3 flex flex-col gap-1.5 shadow-xl border-border bg-background dark:bg-[#1F1F1F] dark:border-white/10 z-[100]"
              >
                <h4 className="font-bold text-sm leading-tight text-foreground">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed italic border-t border-border/50 pt-1.5 mt-0.5">
                  {product.description ||
                    "Nenhuma descrição disponível para este produto."}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Bottom Content: Price & Actions */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider scale-75 origin-left">
                Preço
              </span>
              <span className="text-sm sm:text-base font-extrabold tabular-nums text-primary -mt-1">
                {formatCurrency(product.price || 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ProductCard.displayName = "ProductCard";
