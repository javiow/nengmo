"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { ValidationError } from "@/lib/validation";
import type { Product } from "@/types";

interface ProductRenameModalProps {
  isOpen: boolean;
  product: Product | null;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export function ProductRenameModal({
  isOpen,
  product,
  onSubmit,
  onClose,
}: ProductRenameModalProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    return null;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      onSubmit(name);
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
        <h2 className="text-lg font-semibold">상품 이름 수정</h2>

        <div>
          <label
            htmlFor="product-name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            상품명
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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
