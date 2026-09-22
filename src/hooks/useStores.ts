import { useAppStore } from "@/lib/store/useAppStore";

export function useStores() {
  const stores = useAppStore((state) => state.stores);
  const createStore = useAppStore((state) => state.createStore);
  const updateStore = useAppStore((state) => state.updateStore);
  const deleteStore = useAppStore((state) => state.deleteStore);

  return { stores, createStore, updateStore, deleteStore };
}
