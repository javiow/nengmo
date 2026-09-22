import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShoppingListAddForm } from "./ShoppingListAddForm";
import { validateName } from "@/lib/validation";

describe("ShoppingListAddForm", () => {
  it("이름을 입력해 추가 버튼을 누르면 onAdd가 호출되고 입력값이 초기화된다", () => {
    const onAdd = vi.fn();
    render(<ShoppingListAddForm onAdd={onAdd} />);

    const input = screen.getByLabelText("살 물건 이름");
    fireEvent.change(input, { target: { value: "우유" } });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(onAdd).toHaveBeenCalledWith("우유");
    expect(input).toHaveValue("");
  });

  it("빈 이름이면 인라인 에러 메시지를 표시한다", () => {
    const onAdd = vi.fn((name: string) => {
      validateName(name);
    });
    render(<ShoppingListAddForm onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(
      screen.getByText("이름은 1자 이상 60자 이하여야 합니다."),
    ).toBeInTheDocument();
  });
});
