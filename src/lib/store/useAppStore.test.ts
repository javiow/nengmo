import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidationError } from "../validation";
import { initialState, useAppStore } from "./useAppStore";

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function mockIds(...ids: string[]): void {
  const spy = vi.spyOn(crypto, "randomUUID");
  ids.forEach((id) => {
    spy.mockImplementationOnce(() => id as unknown as ReturnType<typeof crypto.randomUUID>);
  });
}

describe("createStore", () => {
  it("새 가게를 생성해 stores에 추가하고 반환한다", () => {
    mockIds("store-1");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const created = useAppStore.getState().createStore({
      name: "홈플러스",
      category: "hypermarket",
    });

    expect(created).toEqual({
      id: "store-1",
      name: "홈플러스",
      category: "hypermarket",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(useAppStore.getState().stores).toEqual([created]);
  });

  it("이름이 유효하지 않으면 ValidationError를 던지고 상태를 변경하지 않는다", () => {
    expect(() =>
      useAppStore.getState().createStore({ name: "   ", category: "mart" }),
    ).toThrow(ValidationError);
    expect(useAppStore.getState().stores).toEqual([]);
  });
});

describe("updateStore", () => {
  it("name/category를 부분 수정하고 updatedAt을 갱신한다", () => {
    mockIds("store-1");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const created = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
    useAppStore.getState().updateStore(created.id, { name: "이마트" });

    const updated = useAppStore.getState().stores[0];
    expect(updated.name).toBe("이마트");
    expect(updated.category).toBe("hypermarket");
    expect(updated.updatedAt).toBe("2026-01-02T00:00:00.000Z");
  });

  it("이름이 유효하지 않으면 ValidationError를 던지고 상태를 변경하지 않는다", () => {
    mockIds("store-1");
    const created = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    expect(() =>
      useAppStore.getState().updateStore(created.id, { name: "" }),
    ).toThrow(ValidationError);
    expect(useAppStore.getState().stores[0]).toEqual(created);
  });
});

describe("deleteStore", () => {
  it("해당 가게의 shoppingItems/products/priceEntries를 모두 캐스케이드 삭제하고 다른 가게 데이터는 남긴다", () => {
    mockIds(
      "store-1",
      "store-2",
      "item-1",
      "item-2",
      "product-1",
      "price-1",
      "product-2",
      "price-2",
    );

    const store1 = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const store2 = useAppStore
      .getState()
      .createStore({ name: "편의점", category: "convenience" });

    useAppStore.getState().addShoppingItem(store1.id, "우유");
    useAppStore.getState().addShoppingItem(store2.id, "삼각김밥");

    const product1 = useAppStore
      .getState()
      .createProductWithFirstPrice(store1.id, "두부", 1500);
    const product2 = useAppStore
      .getState()
      .createProductWithFirstPrice(store2.id, "삼각김밥", 1200);

    useAppStore.getState().deleteStore(store1.id);

    const state = useAppStore.getState();
    expect(state.stores.map((s) => s.id)).toEqual([store2.id]);
    expect(state.shoppingItems.every((item) => item.storeId !== store1.id)).toBe(
      true,
    );
    expect(state.shoppingItems.some((item) => item.storeId === store2.id)).toBe(
      true,
    );
    expect(state.products.map((p) => p.id)).toEqual([product2.id]);
    expect(
      state.priceEntries.every((pe) => pe.productId !== product1.id),
    ).toBe(true);
    expect(
      state.priceEntries.some((pe) => pe.productId === product2.id),
    ).toBe(true);
  });
});

describe("addShoppingItem / toggleShoppingItem / removeShoppingItem", () => {
  it("장보기 항목을 추가하고 checked: false로 시작한다", () => {
    mockIds("store-1", "item-1");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    const item = useAppStore.getState().addShoppingItem(store.id, "우유");

    expect(item.checked).toBe(false);
    expect(useAppStore.getState().shoppingItems).toEqual([item]);
  });

  it("toggleShoppingItem은 checked를 반전시킨다", () => {
    mockIds("store-1", "item-1");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const item = useAppStore.getState().addShoppingItem(store.id, "우유");

    useAppStore.getState().toggleShoppingItem(item.id);
    expect(useAppStore.getState().shoppingItems[0].checked).toBe(true);

    useAppStore.getState().toggleShoppingItem(item.id);
    expect(useAppStore.getState().shoppingItems[0].checked).toBe(false);
  });

  it("removeShoppingItem은 항목을 제거한다", () => {
    mockIds("store-1", "item-1");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const item = useAppStore.getState().addShoppingItem(store.id, "우유");

    useAppStore.getState().removeShoppingItem(item.id);
    expect(useAppStore.getState().shoppingItems).toEqual([]);
  });

  it("이름이 유효하지 않으면 ValidationError를 던지고 상태를 변경하지 않는다", () => {
    mockIds("store-1");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    expect(() =>
      useAppStore.getState().addShoppingItem(store.id, ""),
    ).toThrow(ValidationError);
    expect(useAppStore.getState().shoppingItems).toEqual([]);
  });
});

describe("createProductWithFirstPrice", () => {
  it("Product와 첫 PriceEntry를 원자적으로 함께 생성한다", () => {
    mockIds("store-1", "product-1", "price-1");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    const product = useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "두부", 1500);

    expect(product).toEqual({
      id: "product-1",
      storeId: store.id,
      name: "두부",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(useAppStore.getState().products).toEqual([product]);
    expect(useAppStore.getState().priceEntries).toEqual([
      {
        id: "price-1",
        productId: product.id,
        price: 1500,
        recordedAt: "2026-01-01T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ]);
  });

  it("이름이 유효하지 않으면 ValidationError를 던지고 product/priceEntry 모두 생성되지 않는다", () => {
    mockIds("store-1");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    expect(() =>
      useAppStore.getState().createProductWithFirstPrice(store.id, "", 1500),
    ).toThrow(ValidationError);
    expect(useAppStore.getState().products).toEqual([]);
    expect(useAppStore.getState().priceEntries).toEqual([]);
  });

  it("가격이 유효하지 않으면 ValidationError를 던지고 product/priceEntry 모두 생성되지 않는다", () => {
    mockIds("store-1");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    expect(() =>
      useAppStore
        .getState()
        .createProductWithFirstPrice(store.id, "두부", -1),
    ).toThrow(ValidationError);
    expect(useAppStore.getState().products).toEqual([]);
    expect(useAppStore.getState().priceEntries).toEqual([]);
  });
});

describe("renameProduct", () => {
  it("상품명을 변경한다", () => {
    mockIds("store-1", "product-1", "price-1");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const product = useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "두부", 1500);

    useAppStore.getState().renameProduct(product.id, "연두부");

    expect(useAppStore.getState().products[0].name).toBe("연두부");
  });

  it("이름이 유효하지 않으면 ValidationError를 던지고 상태를 변경하지 않는다", () => {
    mockIds("store-1", "product-1", "price-1");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const product = useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "두부", 1500);

    expect(() =>
      useAppStore.getState().renameProduct(product.id, ""),
    ).toThrow(ValidationError);
    expect(useAppStore.getState().products[0].name).toBe("두부");
  });
});

describe("deleteProduct", () => {
  it("해당 상품의 priceEntries를 모두 캐스케이드 삭제하고 다른 상품 데이터는 남긴다", () => {
    mockIds(
      "store-1",
      "product-1",
      "price-1",
      "product-2",
      "price-2",
      "price-3",
    );
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const product1 = useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "두부", 1500);
    const product2 = useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "우유", 2500);
    useAppStore.getState().addPriceEntry(product2.id, 2600);

    useAppStore.getState().deleteProduct(product1.id);

    const state = useAppStore.getState();
    expect(state.products.map((p) => p.id)).toEqual([product2.id]);
    expect(
      state.priceEntries.every((pe) => pe.productId !== product1.id),
    ).toBe(true);
    expect(state.priceEntries.filter((pe) => pe.productId === product2.id)).toHaveLength(
      2,
    );
  });
});

describe("addPriceEntry / updatePriceEntryPrice / removePriceEntry", () => {
  it("addPriceEntry는 새 가격 기록을 추가한다", () => {
    mockIds("store-1", "product-1", "price-1", "price-2");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const product = useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "두부", 1500);

    const entry = useAppStore.getState().addPriceEntry(product.id, 1600);

    expect(entry.price).toBe(1600);
    expect(useAppStore.getState().priceEntries).toHaveLength(2);
  });

  it("updatePriceEntryPrice는 price만 바꾸고 recordedAt은 변경하지 않는다", () => {
    mockIds("store-1", "product-1", "price-1");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "두부", 1500);
    const originalEntry = useAppStore.getState().priceEntries[0];

    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
    useAppStore.getState().updatePriceEntryPrice(originalEntry.id, 1700);

    const updatedEntry = useAppStore.getState().priceEntries[0];
    expect(updatedEntry.price).toBe(1700);
    expect(updatedEntry.recordedAt).toBe(originalEntry.recordedAt);
  });

  it("가격이 유효하지 않으면 ValidationError를 던지고 상태를 변경하지 않는다", () => {
    mockIds("store-1", "product-1", "price-1");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "두부", 1500);
    const originalEntry = useAppStore.getState().priceEntries[0];

    expect(() =>
      useAppStore.getState().updatePriceEntryPrice(originalEntry.id, 0),
    ).toThrow(ValidationError);
    expect(useAppStore.getState().priceEntries[0]).toEqual(originalEntry);
  });

  it("removePriceEntry는 가격 기록을 제거한다", () => {
    mockIds("store-1", "product-1", "price-1");
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    useAppStore
      .getState()
      .createProductWithFirstPrice(store.id, "두부", 1500);
    const entry = useAppStore.getState().priceEntries[0];

    useAppStore.getState().removePriceEntry(entry.id);

    expect(useAppStore.getState().priceEntries).toEqual([]);
  });
});
