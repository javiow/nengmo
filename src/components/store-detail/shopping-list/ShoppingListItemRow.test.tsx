import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShoppingListItemRow } from "./ShoppingListItemRow";
import type { ShoppingListItem } from "@/types";

const baseItem: ShoppingListItem = {
  id: "item-1",
  storeId: "store-1",
  name: "우유",
  checked: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("ShoppingListItemRow", () => {
  it("체크되지 않은 항목은 취소선 스타일이 없다", () => {
    render(
      <ShoppingListItemRow item={baseItem} onToggle={vi.fn()} onRemove={vi.fn()} />,
    );

    expect(screen.getByText("우유")).not.toHaveClass("line-through");
  });

  it("체크된 항목은 취소선 스타일이 적용되지만 여전히 렌더링된다", () => {
    render(
      <ShoppingListItemRow
        item={{ ...baseItem, checked: true }}
        onToggle={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("우유")).toHaveClass("line-through");
  });

  it("체크박스를 클릭하면 onToggle이 항목 id와 함께 호출된다", () => {
    const onToggle = vi.fn();
    render(
      <ShoppingListItemRow item={baseItem} onToggle={onToggle} onRemove={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith("item-1");
  });

  it("삭제 버튼을 클릭하면 onRemove가 항목 id와 함께 호출된다", () => {
    const onRemove = vi.fn();
    render(
      <ShoppingListItemRow item={baseItem} onToggle={vi.fn()} onRemove={onRemove} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "우유 삭제" }));

    expect(onRemove).toHaveBeenCalledWith("item-1");
  });
});
