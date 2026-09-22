import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PriceEntryRow } from "./PriceEntryRow";
import type { PriceEntry } from "@/types";

const baseEntry: PriceEntry = {
  id: "price-1",
  productId: "product-1",
  price: 1500,
  recordedAt: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("PriceEntryRow", () => {
  it("가격과 기록일을 표시한다", () => {
    render(
      <PriceEntryRow entry={baseEntry} onUpdatePrice={vi.fn()} onRemove={vi.fn()} />,
    );

    expect(screen.getByText("1,500원")).toBeInTheDocument();
    expect(screen.getByText("2026-01-01")).toBeInTheDocument();
  });

  it("삭제 버튼을 클릭하면 onRemove가 entry id와 함께 호출된다", () => {
    const onRemove = vi.fn();
    render(
      <PriceEntryRow entry={baseEntry} onUpdatePrice={vi.fn()} onRemove={onRemove} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "가격 기록 삭제" }));

    expect(onRemove).toHaveBeenCalledWith("price-1");
  });

  it("수정 버튼을 클릭해 가격을 바꾸고 저장하면 onUpdatePrice가 id/새 가격과 함께 호출된다", () => {
    const onUpdatePrice = vi.fn();
    render(
      <PriceEntryRow
        entry={baseEntry}
        onUpdatePrice={onUpdatePrice}
        onRemove={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "가격 기록 수정" }));
    const input = screen.getByLabelText("수정할 가격");
    fireEvent.change(input, { target: { value: "1700" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(onUpdatePrice).toHaveBeenCalledWith("price-1", 1700);
  });

  it("가격 수정 시 recordedAt은 화면에서 바뀌지 않는다", () => {
    const onUpdatePrice = vi.fn();
    render(
      <PriceEntryRow
        entry={baseEntry}
        onUpdatePrice={onUpdatePrice}
        onRemove={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "가격 기록 수정" }));
    fireEvent.change(screen.getByLabelText("수정할 가격"), {
      target: { value: "1700" },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(screen.getByText("2026-01-01")).toBeInTheDocument();
  });
});
