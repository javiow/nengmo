import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useStores } from "./useStores";
import { initialState, useAppStore } from "@/lib/store/useAppStore";

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe("useStores", () => {
  it("stores와 createStore/updateStore/deleteStore 액션을 노출한다", () => {
    const { result } = renderHook(() => useStores());

    expect(result.current.stores).toEqual([]);

    act(() => {
      result.current.createStore({
        name: "홈플러스",
        category: "hypermarket",
      });
    });

    expect(result.current.stores).toHaveLength(1);
    expect(result.current.stores[0].name).toBe("홈플러스");

    const storeId = result.current.stores[0].id;

    act(() => {
      result.current.updateStore(storeId, { name: "이마트" });
    });

    expect(result.current.stores[0].name).toBe("이마트");

    act(() => {
      result.current.deleteStore(storeId);
    });

    expect(result.current.stores).toEqual([]);
  });
});
