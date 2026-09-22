import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StoreDetailTabs } from "./StoreDetailTabs";

describe("StoreDetailTabs", () => {
  it("기본 탭은 장보기 리스트다", () => {
    render(<StoreDetailTabs />);

    expect(
      screen.getByRole("tab", { name: "장보기 리스트" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByText("장보기 리스트는 다음 step에서 구현 예정입니다."),
    ).toBeInTheDocument();
  });

  it("가격 메모 탭을 클릭하면 해당 placeholder로 전환된다", () => {
    render(<StoreDetailTabs />);

    fireEvent.click(screen.getByRole("tab", { name: "가격 메모" }));

    expect(screen.getByRole("tab", { name: "가격 메모" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByText("가격 메모는 다음 step에서 구현 예정입니다."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("장보기 리스트는 다음 step에서 구현 예정입니다."),
    ).not.toBeInTheDocument();
  });
});
