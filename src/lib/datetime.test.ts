import { describe, expect, it, vi } from "vitest";
import { nowIso } from "./datetime";

describe("nowIso", () => {
  it("현재 시각을 ISO 8601 문자열로 반환한다", () => {
    const fixed = new Date("2026-01-01T00:00:00.000Z");
    const spy = vi
      .spyOn(global, "Date")
      .mockImplementation(() => fixed as unknown as Date);

    expect(nowIso()).toBe("2026-01-01T00:00:00.000Z");

    spy.mockRestore();
  });
});
