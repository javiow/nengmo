import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

function Bomb(): React.ReactElement {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  it("정상 렌더링 시 children을 그대로 보여준다", () => {
    render(
      <ErrorBoundary>
        <p>정상 화면</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("정상 화면")).toBeInTheDocument();
  });

  it("렌더링 중 예외가 발생하면 안내 문구를 표시한다", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText("문제가 발생했습니다. 새로고침 해주세요."),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
