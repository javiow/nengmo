import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  PriceEntry,
  Product,
  ShoppingListItem,
  Store,
  StoreCategory,
} from "@/types";
import { nowIso } from "../datetime";
import { generateId } from "../id";
import { validateName, validatePrice } from "../validation";

interface AppState {
  stores: Store[];
  shoppingItems: ShoppingListItem[];
  products: Product[];
  priceEntries: PriceEntry[];
  createStore: (input: { name: string; category: StoreCategory }) => Store;
  updateStore: (
    id: string,
    patch: { name?: string; category?: StoreCategory },
  ) => void;
  deleteStore: (id: string) => void;
  addShoppingItem: (storeId: string, name: string) => ShoppingListItem;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  createProductWithFirstPrice: (
    storeId: string,
    name: string,
    price: number,
  ) => Product;
  renameProduct: (id: string, name: string) => void;
  deleteProduct: (id: string) => void;
  addPriceEntry: (productId: string, price: number) => PriceEntry;
  updatePriceEntryPrice: (id: string, price: number) => void;
  removePriceEntry: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      stores: [],
      shoppingItems: [],
      products: [],
      priceEntries: [],

      createStore: ({ name, category }) => {
        const validName = validateName(name);
        const now = nowIso();
        const newStore: Store = {
          id: generateId(),
          name: validName,
          category,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ stores: [...state.stores, newStore] }));
        return newStore;
      },

      updateStore: (id, patch) => {
        const validName =
          patch.name !== undefined ? validateName(patch.name) : undefined;
        const now = nowIso();
        set((state) => ({
          stores: state.stores.map((store) =>
            store.id === id
              ? {
                  ...store,
                  ...(validName !== undefined ? { name: validName } : {}),
                  ...(patch.category !== undefined
                    ? { category: patch.category }
                    : {}),
                  updatedAt: now,
                }
              : store,
          ),
        }));
      },

      deleteStore: (id) => {
        set((state) => {
          const deletedProductIds = new Set(
            state.products
              .filter((product) => product.storeId === id)
              .map((product) => product.id),
          );
          return {
            stores: state.stores.filter((store) => store.id !== id),
            shoppingItems: state.shoppingItems.filter(
              (item) => item.storeId !== id,
            ),
            products: state.products.filter((product) => product.storeId !== id),
            priceEntries: state.priceEntries.filter(
              (entry) => !deletedProductIds.has(entry.productId),
            ),
          };
        });
      },

      addShoppingItem: (storeId, name) => {
        const validName = validateName(name);
        const now = nowIso();
        const newItem: ShoppingListItem = {
          id: generateId(),
          storeId,
          name: validName,
          checked: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ shoppingItems: [...state.shoppingItems, newItem] }));
        return newItem;
      },

      toggleShoppingItem: (id) => {
        const now = nowIso();
        set((state) => ({
          shoppingItems: state.shoppingItems.map((item) =>
            item.id === id
              ? { ...item, checked: !item.checked, updatedAt: now }
              : item,
          ),
        }));
      },

      removeShoppingItem: (id) => {
        set((state) => ({
          shoppingItems: state.shoppingItems.filter((item) => item.id !== id),
        }));
      },

      createProductWithFirstPrice: (storeId, name, price) => {
        const validName = validateName(name);
        const validPrice = validatePrice(price);
        const now = nowIso();
        const newProduct: Product = {
          id: generateId(),
          storeId,
          name: validName,
          createdAt: now,
          updatedAt: now,
        };
        const newPriceEntry: PriceEntry = {
          id: generateId(),
          productId: newProduct.id,
          price: validPrice,
          recordedAt: now,
          createdAt: now,
        };
        set((state) => ({
          products: [...state.products, newProduct],
          priceEntries: [...state.priceEntries, newPriceEntry],
        }));
        return newProduct;
      },

      renameProduct: (id, name) => {
        const validName = validateName(name);
        const now = nowIso();
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, name: validName, updatedAt: now }
              : product,
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          priceEntries: state.priceEntries.filter(
            (entry) => entry.productId !== id,
          ),
        }));
      },

      addPriceEntry: (productId, price) => {
        const validPrice = validatePrice(price);
        const now = nowIso();
        const newEntry: PriceEntry = {
          id: generateId(),
          productId,
          price: validPrice,
          recordedAt: now,
          createdAt: now,
        };
        set((state) => ({ priceEntries: [...state.priceEntries, newEntry] }));
        return newEntry;
      },

      updatePriceEntryPrice: (id, price) => {
        const validPrice = validatePrice(price);
        set((state) => ({
          priceEntries: state.priceEntries.map((entry) =>
            entry.id === id ? { ...entry, price: validPrice } : entry,
          ),
        }));
      },

      removePriceEntry: (id) => {
        set((state) => ({
          priceEntries: state.priceEntries.filter((entry) => entry.id !== id),
        }));
      },
    }),
    {
      name: "nengmo:v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn(
            "냉모 저장 데이터를 불러오지 못해 초기 상태를 유지합니다.",
            error,
          );
        }
      },
    },
  ),
);

export const initialState = useAppStore.getState();
