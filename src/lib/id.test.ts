import { describe, expect, it, vi } from "vitest";
import { generateId } from "./id";

describe("generateId", () => {
  it("crypto.randomUUID()의 반환값을 그대로 반환한다", () => {
    const spy = vi
      .spyOn(crypto, "randomUUID")
      .mockReturnValue("00000000-0000-0000-0000-000000000000");

    expect(generateId()).toBe("00000000-0000-0000-0000-000000000000");

    spy.mockRestore();
  });

  it("호출할 때마다 crypto.randomUUID()를 사용한다", () => {
    const spy = vi.spyOn(crypto, "randomUUID");

    generateId();

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });
});
