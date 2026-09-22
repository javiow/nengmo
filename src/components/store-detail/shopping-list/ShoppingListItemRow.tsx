"use client";

import { Trash2 } from "lucide-react";
import type { ShoppingListItem } from "@/types";

interface ShoppingListItemRowProps {
  item: ShoppingListItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ShoppingListItemRow({
  item,
  onToggle,
  onRemove,
}: ShoppingListItemRowProps) {
  return (
    <li className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2">
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => onToggle(item.id)}
        aria-label={`${item.name} 구매 완료`}
        className="h-4 w-4"
      />
      <span
        className={`flex-1 text-sm ${
          item.checked ? "text-gray-400 line-through" : "text-gray-900"
        }`}
      >
        {item.name}
      </span>
      <button
        type="button"
        aria-label={`${item.name} 삭제`}
        onClick={() => onRemove(item.id)}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
}
