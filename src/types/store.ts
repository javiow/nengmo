import type { StoreCategory } from "./category";

export interface Store {
  id: string;
  name: string;
  category: StoreCategory;
  createdAt: string;
  updatedAt: string;
}
