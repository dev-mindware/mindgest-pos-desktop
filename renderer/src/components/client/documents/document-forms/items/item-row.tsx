"use client";

import React from "react";
import { Button } from "@/components";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils";

interface ItemRowProps {
  item: any;
  index: number;
  onRemove: (index: number) => void;
}

export const ItemRow = React.memo<ItemRowProps>(({ item, index, onRemove }) => {
  const subtotal = item.unitPrice * item.quantity;

  return (
    <tr>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-foreground">
            {item.description}
          </span>
          {item.isFromAPI && (
            <span className="inline-flex items-center gap-1 text-xs text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              Do catálogo
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex px-2 py-1 text-xs rounded-full ${item.type === "PRODUCT"
              ? "bg-blue-100 text-blue-800"
              : "bg-purple-100 text-purple-800"
            }`}
        >
          {item.type === "PRODUCT" ? "Produto" : "Serviço"}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-mono text-foreground">
        {item.quantity}
      </td>
      <td className="px-4 py-3 text-right font-mono text-foreground">
        {formatCurrency(item.unitPrice)}
      </td>
      <td className="px-4 py-3 text-right font-mono font-medium text-f">
        {formatCurrency(subtotal)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-foreground">
        {item.tax ? `${item.tax}%` : "Isento"}
      </td>
      <td className="px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
});

ItemRow.displayName = "ItemRow";
