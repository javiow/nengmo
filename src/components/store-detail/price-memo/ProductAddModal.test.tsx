import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductAddModal } from "./ProductAddModal";
import { ValidationError } from "@/lib/validation";

describe("ProductAddModal", () => {
  it("이름과 가격을 함께 입력해 제출하면 onSubmit이 name/price와 함께 호출된다", () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(<ProductAddModal isOpen onSubmit={onSubmit} onClose={onClose} />);

    fireEvent.change(screen.getByLabelText("상품명"), {
      target: { value: "두부" },
    });
    fireEvent.change(screen.getByLabelText("첫 가격"), {
      target: { value: "1500" },
    });
    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "두부", price: 1500 });
    expect(onClose).toHaveBeenCalled();
  });

  it("가격이 유효하지 않으면 인라인 에러를 표시하고 onClose를 호출하지 않는다", () => {
    const onSubmit = vi.fn(() => {
      throw new ValidationError("가격은 0보다 크고 100,000,000 이하여야 합니다.");
    });
    const onClose = vi.fn();
    render(<ProductAddModal isOpen onSubmit={onSubmit} onClose={onClose} />);

    fireEvent.change(screen.getByLabelText("상품명"), {
      target: { value: "두부" },
    });
    fireEvent.change(screen.getByLabelText("첫 가격"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    expect(
      screen.getByText("가격은 0보다 크고 100,000,000 이하여야 합니다."),
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("isOpen이 false면 렌더링하지 않는다", () => {
    render(
      <ProductAddModal
        isOpen={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.queryByLabelText("상품명")).not.toBeInTheDocument();
  });
});
