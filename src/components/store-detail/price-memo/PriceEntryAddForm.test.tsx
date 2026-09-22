import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PriceEntryAddForm } from "./PriceEntryAddForm";
import { validatePrice } from "@/lib/validation";

describe("PriceEntryAddForm", () => {
  it("가격을 입력해 기록 버튼을 누르면 onAdd가 호출되고 입력값이 초기화된다", () => {
    const onAdd = vi.fn();
    render(<PriceEntryAddForm onAdd={onAdd} />);

    const input = screen.getByLabelText("가격");
    fireEvent.change(input, { target: { value: "1500" } });
    fireEvent.click(screen.getByRole("button", { name: "기록" }));

    expect(onAdd).toHaveBeenCalledWith(1500);
    expect(input).toHaveValue(null);
  });

  it("가격이 0 이하이면 인라인 에러 메시지를 표시한다", () => {
    const onAdd = vi.fn((price: number) => {
      validatePrice(price);
    });
    render(<PriceEntryAddForm onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "기록" }));

    expect(
      screen.getByText("가격은 0보다 크고 100,000,000 이하여야 합니다."),
    ).toBeInTheDocument();
  });
});
