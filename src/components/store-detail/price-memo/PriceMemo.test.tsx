import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PriceMemo } from "./PriceMemo";
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

describe("PriceMemo", () => {
  it("상품을 등록하고 선택하면 첫 가격 기록이 표시된다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<PriceMemo storeId={store.id} />);
    addProductThroughUI("두부", "1500");

    fireEvent.click(screen.getByRole("button", { name: "두부" }));

    expect(screen.getByText("1,500원")).toBeInTheDocument();
  });

  it("선택된 상품에 새 가격을 추가하면 이력에 최신순으로 반영된다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<PriceMemo storeId={store.id} />);
    addProductThroughUI("두부", "1500");
    fireEvent.click(screen.getByRole("button", { name: "두부" }));

    fireEvent.change(screen.getByLabelText("가격"), {
      target: { value: "1600" },
    });
    fireEvent.click(screen.getByRole("button", { name: "기록" }));

    const prices = screen.getAllByText(/원$/).map((el) => el.textContent);
    expect(prices).toEqual(["1,600원", "1,500원"]);
  });

  it("상품을 삭제하면 선택이 해제되고 가격 이력 패널이 사라진다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<PriceMemo storeId={store.id} />);
    addProductThroughUI("두부", "1500");
    fireEvent.click(screen.getByRole("button", { name: "두부" }));
    expect(screen.getByText("1,500원")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "두부 삭제" }));
    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(screen.queryByText("1,500원")).not.toBeInTheDocument();
  });
});
