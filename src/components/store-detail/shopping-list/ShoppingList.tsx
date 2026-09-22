"use client";

import { useShoppingList } from "@/hooks/useShoppingList";
import { ShoppingListAddForm } from "./ShoppingListAddForm";
import { ShoppingListItemRow } from "./ShoppingListItemRow";

interface ShoppingListProps {
  storeId: string;
}

export function ShoppingList({ storeId }: ShoppingListProps) {
  const { items, addItem, toggleItem, removeItem } = useShoppingList(storeId);

  return (
    <div className="flex flex-col gap-4">
      <ShoppingListAddForm onAdd={addItem} />

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">살 것을 추가해보세요.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <ShoppingListItemRow
              key={item.id}
              item={item}
              onToggle={toggleItem}
              onRemove={removeItem}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
