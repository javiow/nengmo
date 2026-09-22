import {
  Beef,
  Carrot,
  ShoppingBasket,
  ShoppingCart,
  Store as StoreIcon,
  type LucideIcon,
} from "lucide-react";
import type { StoreCategory } from "@/types/category";

export const CATEGORY_ICON_MAP: Record<StoreCategory, LucideIcon> = {
  mart: ShoppingBasket,
  hypermarket: ShoppingCart,
  convenience: StoreIcon,
  market: Carrot,
  butcher: Beef,
};

export const CATEGORY_LABEL_MAP: Record<StoreCategory, string> = {
  mart: "마트",
  hypermarket: "대형마트",
  convenience: "편의점",
  market: "시장",
  butcher: "정육점",
};

export function getCategoryIcon(category: StoreCategory): LucideIcon {
  return CATEGORY_ICON_MAP[category];
}

export function getCategoryLabel(category: StoreCategory): string {
  return CATEGORY_LABEL_MAP[category];
}
