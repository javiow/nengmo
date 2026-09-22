import { useMemo } from "react";
import { useAppStore } from "@/lib/store/useAppStore";

export function useProducts(storeId: string) {
  const products = useAppStore((state) => state.products);
  const createProductWithFirstPrice = useAppStore(
    (state) => state.createProductWithFirstPrice,
  );
  const renameProduct = useAppStore((state) => state.renameProduct);
  const deleteProduct = useAppStore((state) => state.deleteProduct);

  const filteredProducts = useMemo(
    () => products.filter((product) => product.storeId === storeId),
    [products, storeId],
  );

  return {
    products: filteredProducts,
    createProductWithFirstPrice: (name: string, price: number) =>
      createProductWithFirstPrice(storeId, name, price),
    renameProduct,
    deleteProduct,
  };
}
