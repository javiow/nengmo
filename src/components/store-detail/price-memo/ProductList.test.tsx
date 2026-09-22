import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProductList } from "./ProductList";
import { initialState, useAppStore } from "@/lib/store/useAppStore";

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

function addProductThroughUI(name: string, price: string) {
  fireEvent.click(screen.getByRole("button", { name: "상품 추가" }));
  fireEvent.change(screen.getByLabelText("상품명"), {
    target: { value: name },
  });
  fireEvent.change(screen.getByLabelText("첫 가격"), {
    target: { value: price },
  });
  fireEvent.click(screen.getByRole("button", { name: "등록" }));
}

describe("ProductList", () => {
  it("상품이 없으면 빈 상태를 렌더링한다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(
      <ProductList
        storeId={store.id}
        selectedProductId={null}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("상품을 등록해보세요.")).toBeInTheDocument();
  });

  it("상품을 이름+가격으로 등록하면 Product와 PriceEntry가 함께 생성된다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(
      <ProductList
        storeId={store.id}
        selectedProductId={null}
        onSelect={vi.fn()}
      />,
    );

    addProductThroughUI("두부", "1500");

    expect(screen.getByText("두부")).toBeInTheDocument();
    const product = useAppStore
      .getState()
      .products.find((p) => p.name === "두부");
    expect(product).toBeDefined();
    const entries = useAppStore
      .getState()
      .priceEntries.filter((entry) => entry.productId === product?.id);
    expect(entries).toHaveLength(1);
    expect(entries[0].price).toBe(1500);
  });

  it("상품을 클릭하면 onSelect가 호출된다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });
    const onSelect = vi.fn();

    render(
      <ProductList
        storeId={store.id}
        selectedProductId={null}
        onSelect={onSelect}
      />,
    );
    addProductThroughUI("두부", "1500");

    fireEvent.click(screen.getByRole("button", { name: "두부" }));

    const product = useAppStore.getState().products[0];
    expect(onSelect).toHaveBeenCalledWith(product.id);
  });

  it("삭제 버튼 클릭 시 ConfirmDialog가 뜨고, 확인해야만 삭제된다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(
      <ProductList
        storeId={store.id}
        selectedProductId={null}
        onSelect={vi.fn()}
      />,
    );
    addProductThroughUI("두부", "1500");

    fireEvent.click(screen.getByRole("button", { name: "두부 삭제" }));

    expect(
      screen.getByText("상품을 삭제하면 가격 기록도 함께 삭제됩니다. 계속하시겠습니까?"),
    ).toBeInTheDocument();
    expect(screen.getByText("두부")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(screen.queryByText("두부")).not.toBeInTheDocument();
    expect(useAppStore.getState().products).toEqual([]);
  });

  it("이름 수정 버튼을 클릭해 이름을 바꾸면 목록에 반영된다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(
      <ProductList
        storeId={store.id}
        selectedProductId={null}
        onSelect={vi.fn()}
      />,
    );
    addProductThroughUI("두부", "1500");

    fireEvent.click(screen.getByRole("button", { name: "두부 이름 수정" }));
    const input = screen.getByLabelText("상품명");
    fireEvent.change(input, { target: { value: "두부(국산)" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(screen.getByText("두부(국산)")).toBeInTheDocument();
  });
});
