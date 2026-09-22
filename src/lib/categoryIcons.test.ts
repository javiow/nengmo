import { describe, expect, it } from "vitest";
import {
  Beef,
  Carrot,
  ShoppingBasket,
  ShoppingCart,
  Store as StoreIcon,
} from "lucide-react";
import {
  CATEGORY_ICON_MAP,
  CATEGORY_LABEL_MAP,
  getCategoryIcon,
  getCategoryLabel,
} from "./categoryIcons";

describe("categoryIcons", () => {
  it("카테고리별 아이콘을 올바르게 매핑한다", () => {
    expect(CATEGORY_ICON_MAP.mart).toBe(ShoppingBasket);
    expect(CATEGORY_ICON_MAP.hypermarket).toBe(ShoppingCart);
    expect(CATEGORY_ICON_MAP.convenience).toBe(StoreIcon);
    expect(CATEGORY_ICON_MAP.market).toBe(Carrot);
    expect(CATEGORY_ICON_MAP.butcher).toBe(Beef);
  });

  it("카테고리별 한글 라벨을 올바르게 매핑한다", () => {
    expect(CATEGORY_LABEL_MAP.mart).toBe("마트");
    expect(CATEGORY_LABEL_MAP.hypermarket).toBe("대형마트");
    expect(CATEGORY_LABEL_MAP.convenience).toBe("편의점");
    expect(CATEGORY_LABEL_MAP.market).toBe("시장");
    expect(CATEGORY_LABEL_MAP.butcher).toBe("정육점");
  });

  it("getCategoryIcon은 CATEGORY_ICON_MAP과 동일한 값을 반환한다", () => {
    expect(getCategoryIcon("mart")).toBe(CATEGORY_ICON_MAP.mart);
    expect(getCategoryIcon("butcher")).toBe(CATEGORY_ICON_MAP.butcher);
  });

  it("getCategoryLabel은 CATEGORY_LABEL_MAP과 동일한 값을 반환한다", () => {
    expect(getCategoryLabel("market")).toBe(CATEGORY_LABEL_MAP.market);
    expect(getCategoryLabel("convenience")).toBe(
      CATEGORY_LABEL_MAP.convenience,
    );
  });
});
