import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { StoreCard } from "./StoreCard";
import type { Store } from "@/types";

const store: Store = {
  id: "store-1",
  name: "홈플러스",
  category: "hypermarket",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("StoreCard", () => {
  it("가게 이름과 카테고리 라벨을 표시하고 상세 페이지 링크를 가진다", () => {
    render(<StoreCard store={store} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("홈플러스")).toBeInTheDocument();
    expect(screen.getByText("대형마트")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/stores/store-1",
    );
  });

  it("메뉴에서 수정을 클릭하면 onEdit이 해당 store와 함께 호출된다", () => {
    const onEdit = vi.fn();
    render(<StoreCard store={store} onEdit={onEdit} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "가게 메뉴" }));
    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    expect(onEdit).toHaveBeenCalledWith(store);
  });

  it("메뉴에서 삭제를 클릭하면 onDelete가 해당 store와 함께 호출된다", () => {
    const onDelete = vi.fn();
    render(<StoreCard store={store} onEdit={vi.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole("button", { name: "가게 메뉴" }));
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));

    expect(onDelete).toHaveBeenCalledWith(store);
  });
});
