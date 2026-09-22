"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProductAddModal } from "./ProductAddModal";
import { ProductRenameModal } from "./ProductRenameModal";
import { ProductListItem } from "./ProductListItem";
import type { Product } from "@/types";

interface ProductListProps {
  storeId: string;
  selectedProductId: string | null;
  onSelect: (id: string) => void;
}

export function ProductList({
  storeId,
  selectedProductId,
  onSelect,
}: ProductListProps) {
  const { products, createProductWithFirstPrice, renameProduct, deleteProduct } =
    useProducts(storeId);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [renamingProduct, setRenamingProduct] = useState<Product | null>(
    null,
  );
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(
    null,
  );

  function confirmDelete() {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">상품</h3>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
          상품 추가
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-gray-500">상품을 등록해보세요.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              isSelected={product.id === selectedProductId}
              onSelect={onSelect}
              onRename={setRenamingProduct}
              onDelete={setDeletingProduct}
            />
          ))}
        </ul>
      )}

      <ProductAddModal
        isOpen={isAddOpen}
        onSubmit={({ name, price }) =>
          createProductWithFirstPrice(name, price)
        }
        onClose={() => setIsAddOpen(false)}
      />

      <ProductRenameModal
        key={renamingProduct?.id ?? "none"}
        isOpen={renamingProduct !== null}
        product={renamingProduct}
        onSubmit={(name) => {
          if (renamingProduct) {
            renameProduct(renamingProduct.id, name);
          }
        }}
        onClose={() => setRenamingProduct(null)}
      />

      <ConfirmDialog
        isOpen={deletingProduct !== null}
        message="상품을 삭제하면 가격 기록도 함께 삭제됩니다. 계속하시겠습니까?"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingProduct(null)}
      />
    </div>
  );
}
