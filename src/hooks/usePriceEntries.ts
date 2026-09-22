import { useMemo } from "react";
import { useAppStore } from "@/lib/store/useAppStore";

export function usePriceEntries(productId: string) {
  const priceEntries = useAppStore((state) => state.priceEntries);
  const addPriceEntryAction = useAppStore((state) => state.addPriceEntry);
  const updatePriceEntryPrice = useAppStore(
    (state) => state.updatePriceEntryPrice,
  );
  const removePriceEntry = useAppStore((state) => state.removePriceEntry);

  const entries = useMemo(
    () =>
      priceEntries
        .filter((entry) => entry.productId === productId)
        .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),
    [priceEntries, productId],
  );

  return {
    entries,
    addPriceEntry: (price: number) => addPriceEntryAction(productId, price),
    updatePriceEntryPrice,
    removePriceEntry,
  };
}
