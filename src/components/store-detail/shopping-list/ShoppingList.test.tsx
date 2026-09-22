import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ShoppingList } from "./ShoppingList";
import { initialState, useAppStore } from "@/lib/store/useAppStore";

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

function addItemThroughUI(name: string) {
  fireEvent.change(screen.getByLabelText("살 물건 이름"), {
    target: { value: name },
  });
  fireEvent.click(screen.getByRole("button", { name: "추가" }));
}

describe("ShoppingList", () => {
  it("항목이 없으면 빈 상태를 렌더링한다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<ShoppingList storeId={store.id} />);

    expect(screen.getByText("살 것을 추가해보세요.")).toBeInTheDocument();
  });

  it("항목을 추가하면 리스트에 표시된다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<ShoppingList storeId={store.id} />);
    addItemThroughUI("우유");

    expect(screen.getByText("우유")).toBeInTheDocument();
    expect(
      screen.queryByText("살 것을 추가해보세요."),
    ).not.toBeInTheDocument();
  });

  it("체크하면 취소선 스타일이 적용되고 리스트에서 사라지지 않는다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<ShoppingList storeId={store.id} />);
    addItemThroughUI("우유");

    fireEvent.click(screen.getByRole("checkbox"));

    expect(screen.getByText("우유")).toBeInTheDocument();
    expect(screen.getByText("우유")).toHaveClass("line-through");
  });

  it("삭제 버튼을 누르면 리스트에서 제거된다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<ShoppingList storeId={store.id} />);
    addItemThroughUI("우유");

    fireEvent.click(screen.getByRole("button", { name: "우유 삭제" }));

    expect(screen.queryByText("우유")).not.toBeInTheDocument();
    expect(screen.getByText("살 것을 추가해보세요.")).toBeInTheDocument();
  });

  it("빈 이름으로 추가를 시도하면 인라인 에러가 표시된다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<ShoppingList storeId={store.id} />);
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(
      screen.getByText("이름은 1자 이상 60자 이하여야 합니다."),
    ).toBeInTheDocument();
  });
});
