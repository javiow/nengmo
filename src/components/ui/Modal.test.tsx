import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("isOpen이 false면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>내용</p>
      </Modal>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("isOpen이 true면 children을 렌더링한다", () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <p>내용</p>
      </Modal>,
    );

    expect(screen.getByText("내용")).toBeInTheDocument();
  });

  it("오버레이 클릭 시 onClose가 호출된다", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <p>내용</p>
      </Modal>,
    );

    fireEvent.click(screen.getByTestId("modal-overlay"));

    expect(onClose).toHaveBeenCalled();
  });

  it("내용 영역 클릭 시에는 onClose가 호출되지 않는다", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <p>내용</p>
      </Modal>,
    );

    fireEvent.click(screen.getByText("내용"));

    expect(onClose).not.toHaveBeenCalled();
  });
});
