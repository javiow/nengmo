import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useShoppingList } from "./useShoppingList";
import { initialState, useAppStore } from "@/lib/store/useAppStore";

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe("useShoppingList", () => {
  it("storeId로 필터링된 items와 addItem/toggleItem/removeItem 액션을 노출한다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const otherStore = useAppStore
      .getState()
      .createStore({ name: "이마트", category: "mart" });
    useAppStore.getState().addShoppingItem(otherStore.id, "다른가게 상품");

    const { result } = renderHook(() => useShoppingList(store.id));

    expect(result.current.items).toEqual([]);

    act(() => {
      result.current.addItem("우유");
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe("우유");

    const itemId = result.current.items[0].id;

    act(() => {
      result.current.toggleItem(itemId);
    });

    expect(result.current.items[0].checked).toBe(true);

    act(() => {
      result.current.removeItem(itemId);
    });

    expect(result.current.items).toEqual([]);
  });
});
