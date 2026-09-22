"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { ValidationError } from "@/lib/validation";

interface ProductAddModalProps {
  isOpen: boolean;
  onSubmit: (input: { name: string; price: number }) => void;
  onClose: () => void;
}

export function ProductAddModal({
  isOpen,
  onSubmit,
  onClose,
}: ProductAddModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
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
      onSubmit({ name, price: Number(price) });
      setName("");
      setPrice("");
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
        <h2 className="text-lg font-semibold">상품 추가</h2>

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
        </div>

        <div>
          <label
            htmlFor="product-price"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            첫 가격
          </label>
          <input
            id="product-price"
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
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
            등록
          </button>
        </div>
      </form>
    </Modal>
  );
}
