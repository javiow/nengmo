import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PriceEntryList } from "./PriceEntryList";
import type { PriceEntry } from "@/types";

const entries: PriceEntry[] = [
  {
    id: "price-2",
    productId: "product-1",
    price: 1600,
    recordedAt: "2026-01-02T00:00:00.000Z",
    createdAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "price-1",
    productId: "product-1",
    price: 1500,
    recordedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("PriceEntryList", () => {
  it("가격 기록이 없으면 빈 상태를 렌더링한다", () => {
    render(
      <PriceEntryList
        entries={[]}
        onUpdatePrice={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("첫 가격을 기록해보세요.")).toBeInTheDocument();
  });

  it("전달받은 순서(최신순)대로 가격 기록을 렌더링한다", () => {
    render(
      <PriceEntryList
        entries={entries}
        onUpdatePrice={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    const prices = screen.getAllByText(/원$/).map((el) => el.textContent);
    expect(prices).toEqual(["1,600원", "1,500원"]);
  });

  it("삭제 버튼을 클릭하면 onRemove가 해당 entry id와 함께 호출된다", () => {
    const onRemove = vi.fn();
    render(
      <PriceEntryList
        entries={entries}
        onUpdatePrice={vi.fn()}
        onRemove={onRemove}
      />,
    );

    fireEvent.click(screen.getAllByRole("button", { name: "가격 기록 삭제" })[0]);

    expect(onRemove).toHaveBeenCalledWith("price-2");
  });
});
