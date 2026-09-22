import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppHydrator } from "./AppHydrator";
import { useAppStore } from "@/lib/store/useAppStore";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AppHydrator", () => {
  it("마운트 시 persist.rehydrate를 한 번 호출한다", () => {
    const rehydrateSpy = vi
      .spyOn(useAppStore.persist, "rehydrate")
      .mockImplementation(() => Promise.resolve());

    render(<AppHydrator />);

    expect(rehydrateSpy).toHaveBeenCalledTimes(1);
  });

  it("아무것도 렌더링하지 않는다", () => {
    vi.spyOn(useAppStore.persist, "rehydrate").mockImplementation(() =>
      Promise.resolve(),
    );

    const { container } = render(<AppHydrator />);

    expect(container).toBeEmptyDOMElement();
  });
});
