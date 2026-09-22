import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePriceEntries } from "./usePriceEntries";
import { initialState, useAppStore } from "@/lib/store/useAppStore";

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("usePriceEntries", () => {
  it("productId로 필터링된 entries를 recordedAt 최신순으로 노출하고 addPriceEntry/updatePriceEntryPrice/removePriceEntry 액션을 제공한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const product = useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "두부", 1500);
    const otherProduct = useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "우유", 2500);
    useAppStore.getState().addPriceEntry(otherProduct.id, 2600);

    const { result } = renderHook(() => usePriceEntries(product.id));

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].price).toBe(1500);

    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
    act(() => {
      result.current.addPriceEntry(1600);
    });

    expect(result.current.entries).toHaveLength(2);
    expect(result.current.entries[0].price).toBe(1600);
    expect(result.current.entries[1].price).toBe(1500);

    const latestEntryId = result.current.entries[0].id;

    act(() => {
      result.current.updatePriceEntryPrice(latestEntryId, 1650);
    });

    expect(result.current.entries[0].price).toBe(1650);

    act(() => {
      result.current.removePriceEntry(latestEntryId);
    });

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].price).toBe(1500);
  });
});
