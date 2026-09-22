"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useStores } from "@/hooks/useStores";
import { StoreCard } from "./StoreCard";
import { StoreFormModal } from "./StoreFormModal";
import { EmptyBoardState } from "./EmptyBoardState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Store, StoreCategory } from "@/types";

export function StoreBoard() {
  const { stores, createStore, updateStore, deleteStore } = useStores();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | undefined>(
    undefined,
  );
  const [formKey, setFormKey] = useState(0);
  const [deletingStore, setDeletingStore] = useState<Store | null>(null);

  function openCreateForm() {
    setEditingStore(undefined);
    setFormKey((key) => key + 1);
    setIsFormOpen(true);
  }

  function openEditForm(store: Store) {
    setEditingStore(store);
    setFormKey((key) => key + 1);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingStore(undefined);
  }

  function handleSubmit(input: { name: string; category: StoreCategory }) {
    if (editingStore) {
      updateStore(editingStore.id, input);
    } else {
      createStore(input);
    }
  }

  function confirmDelete() {
    if (deletingStore) {
      deleteStore(deletingStore.id);
      setDeletingStore(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">냉모</h1>
        {stores.length > 0 && (
          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            가게 추가
          </button>
        )}
      </div>

      {stores.length === 0 ? (
        <EmptyBoardState onAddStore={openCreateForm} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onEdit={openEditForm}
              onDelete={setDeletingStore}
            />
          ))}
        </div>
      )}

      <StoreFormModal
        key={formKey}
        isOpen={isFormOpen}
        initialValue={editingStore}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <ConfirmDialog
        isOpen={deletingStore !== null}
        message="가게를 삭제하면 리스트/상품/가격기록도 함께 삭제됩니다. 계속하시겠습니까?"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingStore(null)}
      />
    </div>
  );
}
