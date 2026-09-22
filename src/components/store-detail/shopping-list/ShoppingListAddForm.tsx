"use client";

import { useState, type FormEvent } from "react";
import { ValidationError } from "@/lib/validation";

interface ShoppingListAddFormProps {
  onAdd: (name: string) => void;
}

export function ShoppingListAddForm({ onAdd }: ShoppingListAddFormProps) {
  const [name, setName] = useState("");
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
      onAdd(name);
      setName("");
      setIsSubmitting(false);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="살 물건 이름"
          aria-label="살 물건 이름"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          추가
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
