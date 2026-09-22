import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { StoreBoard } from "./StoreBoard";
import { initialState, useAppStore } from "@/lib/store/useAppStore";

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

function createStoreThroughUI(name: string) {
  fireEvent.click(screen.getByRole("button", { name: "가게 추가" }));
  fireEvent.change(screen.getByLabelText("이름"), {
    target: { value: name },
  });
  fireEvent.click(screen.getByRole("button", { name: "저장" }));
}

describe("StoreBoard", () => {
  it("가게가 없으면 빈 상태를 렌더링한다", () => {
    render(<StoreBoard />);

    expect(
      screen.getByText("자주 가는 가게를 등록해보세요."),
    ).toBeInTheDocument();
  });

  it("가게를 생성하면 카드로 표시된다", () => {
    render(<StoreBoard />);

    createStoreThroughUI("홈플러스");

    expect(screen.getByText("홈플러스")).toBeInTheDocument();
  });

  it("삭제는 확인 다이얼로그를 거친 뒤에만 실행되고, 취소하면 가게가 유지된다", () => {
    render(<StoreBoard />);
    createStoreThroughUI("홈플러스");

    fireEvent.click(screen.getByRole("button", { name: "가게 메뉴" }));
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));

    expect(
      screen.getByText(
        "가게를 삭제하면 리스트/상품/가격기록도 함께 삭제됩니다. 계속하시겠습니까?",
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(screen.getByText("홈플러스")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "가게 메뉴" }));
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(screen.queryByText("홈플러스")).not.toBeInTheDocument();
  });
});
