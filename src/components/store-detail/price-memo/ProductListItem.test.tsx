import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductListItem } from "./ProductListItem";
import type { Product } from "@/types";

const baseProduct: Product = {
  id: "product-1",
  storeId: "store-1",
  name: "두부",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("ProductListItem", () => {
  it("상품명을 클릭하면 onSelect가 product id와 함께 호출된다", () => {
    const onSelect = vi.fn();
    render(
      <ProductListItem
        product={baseProduct}
        isSelected={false}
        onSelect={onSelect}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "두부" }));

    expect(onSelect).toHaveBeenCalledWith("product-1");
  });

  it("이름 수정 버튼을 클릭하면 onRename이 product와 함께 호출된다", () => {
    const onRename = vi.fn();
    render(
      <ProductListItem
        product={baseProduct}
        isSelected={false}
        onSelect={vi.fn()}
        onRename={onRename}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "두부 이름 수정" }));

    expect(onRename).toHaveBeenCalledWith(baseProduct);
  });

  it("삭제 버튼을 클릭하면 onDelete가 product와 함께 호출된다", () => {
    const onDelete = vi.fn();
    render(
      <ProductListItem
        product={baseProduct}
        isSelected={false}
        onSelect={vi.fn()}
        onRename={vi.fn()}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "두부 삭제" }));

    expect(onDelete).toHaveBeenCalledWith(baseProduct);
  });

  it("선택된 상품은 강조 스타일이 적용된다", () => {
    render(
      <ProductListItem
        product={baseProduct}
        isSelected
        onSelect={vi.fn()}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByRole("listitem")).toHaveClass("border-blue-500");
  });
});
