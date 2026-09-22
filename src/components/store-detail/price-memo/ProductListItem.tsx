"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types";

interface ProductListItemProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRename: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductListItem({
  product,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}: ProductListItemProps) {
  return (
    <li
      className={`flex items-center gap-2 rounded border px-3 py-2 ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(product.id)}
        className="flex-1 text-left text-sm text-gray-900"
      >
        {product.name}
      </button>
      <button
        type="button"
        aria-label={`${product.name} 이름 수정`}
        onClick={() => onRename(product)}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={`${product.name} 삭제`}
        onClick={() => onDelete(product)}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
}
