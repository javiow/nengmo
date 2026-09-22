"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { CATEGORY_LABEL_MAP, getCategoryIcon } from "@/lib/categoryIcons";
import { ValidationError } from "@/lib/validation";
import type { Store, StoreCategory } from "@/types";

interface StoreFormModalProps {
  isOpen: boolean;
  initialValue?: Store;
  onSubmit: (input: { name: string; category: StoreCategory }) => void;
  onClose: () => void;
}

const CATEGORIES = Object.keys(CATEGORY_LABEL_MAP) as StoreCategory[];

export function StoreFormModal({
  isOpen,
  initialValue,
  onSubmit,
  onClose,
}: StoreFormModalProps) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [category, setCategory] = useState<StoreCategory>(
    initialValue?.category ?? CATEGORIES[0],
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      onSubmit({ name, category });
      onClose();
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        throw err;
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          {initialValue ? "가게 수정" : "가게 추가"}
        </h2>

        <div>
          <label
            htmlFor="store-name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            이름
          </label>
          <input
            id="store-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-gray-700">카테고리</p>
          <div className="grid grid-cols-5 gap-2">
            {CATEGORIES.map((c) => {
              const Icon = getCategoryIcon(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={`flex flex-col items-center gap-1 rounded border p-2 text-xs ${
                    category === c
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {CATEGORY_LABEL_MAP[c]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            저장
          </button>
        </div>
      </form>
    </Modal>
  );
}
