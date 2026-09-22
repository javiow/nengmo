import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StoreDetailScreen } from "./StoreDetailScreen";
import { initialState, useAppStore } from "@/lib/store/useAppStore";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

beforeEach(async () => {
  replaceMock.mockClear();
  useAppStore.setState(initialState, true);
  await act(async () => {
    await useAppStore.persist.rehydrate();
  });
});

describe("StoreDetailScreen", () => {
  it("존재하는 storeId면 가게 이름과 탭을 렌더링하고 리다이렉트하지 않는다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "홈플러스", category: "hypermarket" });

    render(<StoreDetailScreen storeId={store.id} />);

    expect(screen.getByText("홈플러스")).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "장보기 리스트" }),
    ).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("존재하지 않는 storeId면 보드로 리다이렉트한다", () => {
    render(<StoreDetailScreen storeId="not-exist" />);

    expect(replaceMock).toHaveBeenCalledWith("/");
  });

  it("보드로 돌아가는 링크를 렌더링한다", () => {
    const store = useAppStore
      .getState()
      .createStore({ name: "이마트", category: "mart" });

    render(<StoreDetailScreen storeId={store.id} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });
});
