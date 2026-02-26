import { memo } from "react";
import { ItemRow } from "./item-row";
import { useModal } from "@/stores";

interface ItemListProps {
  items: any[];
  onRemove: (index: number) => void;
}

export const ItemList = memo<ItemListProps>(({ items, onRemove }) => {
  const { openModal } = useModal();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">
          Lista de Itens
        </h4>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
        <table className="w-full">
          <thead className="bg-card border-border">
            <tr className="text-foreground">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                Qtd.
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                Preço Unit.
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                Subtotal
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                IVA (%)
              </th>
              <th className="px-4 py-3 w-[60px]" aria-label="Ações" />

            </tr>

          </thead>
          <tbody className="divide-y divide-gray-200 bg-c">
            {items.map((item, index) => (
              <ItemRow
                key={item.id || index}
                item={item}
                index={index}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});


ItemList.displayName = "ItemList";
