import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyBoardState } from "./EmptyBoardState";

describe("EmptyBoardState", () => {
  it("안내 문구와 가게 추가 버튼을 표시한다", () => {
    render(<EmptyBoardState onAddStore={vi.fn()} />);

    expect(
      screen.getByText("자주 가는 가게를 등록해보세요."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "가게 추가" }),
    ).toBeInTheDocument();
  });

  it("가게 추가 버튼 클릭 시 onAddStore가 호출된다", () => {
    const onAddStore = vi.fn();
    render(<EmptyBoardState onAddStore={onAddStore} />);

    fireEvent.click(screen.getByRole("button", { name: "가게 추가" }));

    expect(onAddStore).toHaveBeenCalled();
  });
});
