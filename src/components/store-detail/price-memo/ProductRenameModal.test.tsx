import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductRenameModal } from "./ProductRenameModal";
import { ValidationError } from "@/lib/validation";
import type { Product } from "@/types";

const baseProduct: Product = {
  id: "product-1",
  storeId: "store-1",
  name: "두부",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("ProductRenameModal", () => {
  it("기존 이름이 입력값으로 채워지고, 수정 후 제출하면 onSubmit이 새 이름과 함께 호출된다", () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      <ProductRenameModal
        isOpen
        product={baseProduct}
        onSubmit={onSubmit}
        onClose={onClose}
      />,
    );

    const input = screen.getByLabelText("상품명");
    expect(input).toHaveValue("두부");

    fireEvent.change(input, { target: { value: "두부(국산)" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(onSubmit).toHaveBeenCalledWith("두부(국산)");
    expect(onClose).toHaveBeenCalled();
  });

  it("이름이 비어 있으면 인라인 에러를 표시하고 onClose를 호출하지 않는다", () => {
    const onSubmit = vi.fn(() => {
      throw new ValidationError("이름은 1자 이상 60자 이하여야 합니다.");
    });
    const onClose = vi.fn();
    render(
      <ProductRenameModal
        isOpen
        product={baseProduct}
        onSubmit={onSubmit}
        onClose={onClose}
      />,
    );

    fireEvent.change(screen.getByLabelText("상품명"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(
      screen.getByText("이름은 1자 이상 60자 이하여야 합니다."),
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("product가 없으면 렌더링하지 않는다", () => {
    render(
      <ProductRenameModal
        isOpen
        product={null}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.queryByLabelText("상품명")).not.toBeInTheDocument();
  });
});
