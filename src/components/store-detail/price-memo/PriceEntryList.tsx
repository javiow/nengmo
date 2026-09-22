"use client";

import { PriceEntryRow } from "./PriceEntryRow";
import type { PriceEntry } from "@/types";

interface PriceEntryListProps {
  entries: PriceEntry[];
  onUpdatePrice: (id: string, price: number) => void;
  onRemove: (id: string) => void;
}

export function PriceEntryList({
  entries,
  onUpdatePrice,
  onRemove,
}: PriceEntryListProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">첫 가격을 기록해보세요.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <PriceEntryRow
          key={entry.id}
          entry={entry}
          onUpdatePrice={onUpdatePrice}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
