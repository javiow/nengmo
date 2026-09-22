"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ValidationError } from "@/lib/validation";
import type { PriceEntry } from "@/types";

interface PriceEntryRowProps {
  entry: PriceEntry;
  onUpdatePrice: (id: string, price: number) => void;
  onRemove: (id: string) => void;
}

export function PriceEntryRow({
  entry,
  onUpdatePrice,
  onRemove,
}: PriceEntryRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(String(entry.price));
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setPrice(String(entry.price));
    setError(null);
    setIsEditing(true);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      onUpdatePrice(entry.id, Number(price));
      setError(null);
      setIsEditing(false);
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else {
        throw err;
      }
    }
  }

  if (isEditing) {
    return (
      <li className="rounded border border-gray-200 px-3 py-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              aria-label="수정할 가격"
              className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
            >
              저장
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {entry.price.toLocaleString("ko-KR")}원
        </p>
        <p className="text-xs text-gray-500">{entry.recordedAt.slice(0, 10)}</p>
      </div>
      <button
        type="button"
        aria-label="가격 기록 수정"
        onClick={startEditing}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="가격 기록 삭제"
        onClick={() => onRemove(entry.id)}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
}
