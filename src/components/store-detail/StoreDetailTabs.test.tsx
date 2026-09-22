import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { StoreDetailTabs } from "./StoreDetailTabs";
import { initialState, useAppStore } from "@/lib/store/useAppStore";

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe("StoreDetailTabs", () => {
  it("기본 탭은 장보기 리스트다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<StoreDetailTabs storeId={store.id} />);

    expect(
      screen.getByRole("tab", { name: "장보기 리스트" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByText("살 것을 추가해보세요."),
    ).toBeInTheDocument();
  });

  it("가격 메모 탭을 클릭하면 가격 메모 화면으로 전환된다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<StoreDetailTabs storeId={store.id} />);

    fireEvent.click(screen.getByRole("tab", { name: "가격 메모" }));

    expect(screen.getByRole("tab", { name: "가격 메모" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("상품을 등록해보세요.")).toBeInTheDocument();
    expect(
      screen.queryByText("살 것을 추가해보세요."),
    ).not.toBeInTheDocument();
  });
});
