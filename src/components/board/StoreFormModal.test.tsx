import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { StoreFormModal } from "./StoreFormModal";
import { validateName } from "@/lib/validation";
import type { StoreCategory } from "@/types";

describe("StoreFormModal", () => {
  it("이름이 비어있으면 인라인 에러 메시지를 표시하고 onClose를 호출하지 않는다", () => {
    const onSubmit = vi.fn((input: { name: string; category: StoreCategory }) => {
      validateName(input.name);
    });
    const onClose = vi.fn();
    render(<StoreFormModal isOpen onSubmit={onSubmit} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(
      screen.getByText("이름은 1자 이상 60자 이하여야 합니다."),
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("이름이 61자이면 인라인 에러 메시지를 표시한다", () => {
    const onSubmit = vi.fn((input: { name: string; category: StoreCategory }) => {
      validateName(input.name);
    });
    render(<StoreFormModal isOpen onSubmit={onSubmit} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("이름"), {
      target: { value: "가".repeat(61) },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(
      screen.getByText("이름은 1자 이상 60자 이하여야 합니다."),
    ).toBeInTheDocument();
  });

  it("연타해도 onSubmit은 한 번만 호출된다", () => {
    const onSubmit = vi.fn();
    render(<StoreFormModal isOpen onSubmit={onSubmit} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("이름"), {
      target: { value: "홈플러스" },
    });
    const submitButton = screen.getByRole("button", { name: "저장" });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("initialValue가 있으면 기존 값으로 폼을 채운다", () => {
    render(
      <StoreFormModal
        isOpen
        initialValue={{
          id: "store-1",
          name: "이마트",
          category: "hypermarket",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("이름")).toHaveValue("이마트");
  });
});
