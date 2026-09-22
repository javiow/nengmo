import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useProducts } from "./useProducts";
import { initialState, useAppStore } from "@/lib/store/useAppStore";

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe("useProducts", () => {
  it("storeId로 필터링된 products와 createProductWithFirstPrice/renameProduct/deleteProduct 액션을 노출한다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const otherStore = useAppStore
      .getState()
      .createStore({ name: "이마트", category: "mart" });
    useAppStore.getState().createProductWithFirstPrice(
      otherStore.id,
      "다른가게 상품",
      1000,
    );

    const { result } = renderHook(() => useProducts(store.id));

    expect(result.current.products).toEqual([]);

    act(() => {
      result.current.createProductWithFirstPrice("두부", 1500);
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].name).toBe("두부");

    const productId = result.current.products[0].id;
    expect(
      useAppStore
        .getState()
        .priceEntries.filter((entry) => entry.productId === productId),
    ).toHaveLength(1);
    expect(
      useAppStore
        .getState()
        .priceEntries.find((entry) => entry.productId === productId)?.price,
    ).toBe(1500);

    act(() => {
      result.current.renameProduct(productId, "두부(국산)");
    });

    expect(result.current.products[0].name).toBe("두부(국산)");

    act(() => {
      result.current.deleteProduct(productId);
    });

    expect(result.current.products).toEqual([]);
  });
});
