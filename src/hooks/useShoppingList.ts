import { useMemo } from "react";
import { useAppStore } from "@/lib/store/useAppStore";

export function useShoppingList(storeId: string) {
  const shoppingItems = useAppStore((state) => state.shoppingItems);
  const addShoppingItem = useAppStore((state) => state.addShoppingItem);
  const toggleShoppingItem = useAppStore((state) => state.toggleShoppingItem);
  const removeShoppingItem = useAppStore((state) => state.removeShoppingItem);

  const items = useMemo(
    () => shoppingItems.filter((item) => item.storeId === storeId),
    [shoppingItems, storeId],
  );

  return {
    items,
    addItem: (name: string) => addShoppingItem(storeId, name),
    toggleItem: toggleShoppingItem,
    removeItem: removeShoppingItem,
  };
}
