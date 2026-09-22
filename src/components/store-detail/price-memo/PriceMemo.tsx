"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { usePriceEntries } from "@/hooks/usePriceEntries";
import { ProductList } from "./ProductList";
import { PriceEntryAddForm } from "./PriceEntryAddForm";
import { PriceEntryList } from "./PriceEntryList";

interface PriceMemoProps {
  storeId: string;
}

export function PriceMemo({ storeId }: PriceMemoProps) {
  const { products } = useProducts(storeId);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  const { entries, addPriceEntry, updatePriceEntryPrice, removePriceEntry } =
    usePriceEntries(selectedProduct?.id ?? "");

  return (
    <div className="flex flex-col gap-4">
      <ProductList
        storeId={storeId}
        selectedProductId={selectedProductId}
        onSelect={setSelectedProductId}
      />

      {selectedProduct && (
        <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700">
            {selectedProduct.name} 가격 이력
          </h3>
          <PriceEntryAddForm onAdd={addPriceEntry} />
          <PriceEntryList
            entries={entries}
            onUpdatePrice={updatePriceEntryPrice}
            onRemove={removePriceEntry}
          />
        </div>
      )}
    </div>
  );
}
