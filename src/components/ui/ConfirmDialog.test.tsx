import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  it("message를 표시하고 확인/취소 버튼을 렌더링한다", () => {
    render(
      <ConfirmDialog
        isOpen
        message="정말 삭제하시겠습니까?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("정말 삭제하시겠습니까?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("확인/취소 버튼 클릭 시 각각의 콜백을 호출한다", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        message="정말 삭제하시겠습니까?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "확인" }));
    expect(onConfirm).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("isOpen이 false면 렌더링하지 않는다", () => {
    render(
      <ConfirmDialog
        isOpen={false}
        message="정말 삭제하시겠습니까?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.queryByText("정말 삭제하시겠습니까?"),
    ).not.toBeInTheDocument();
  });
});
