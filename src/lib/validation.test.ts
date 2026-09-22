import { describe, expect, it } from "vitest";
import { ValidationError, validateName, validatePrice } from "./validation";

describe("validateName", () => {
  it("앞뒤 공백을 제거한 문자열을 반환한다", () => {
    expect(validateName("  사과  ")).toBe("사과");
  });

  it("길이가 1자면 통과한다", () => {
    expect(validateName("a")).toBe("a");
  });

  it("길이가 정확히 60자면 통과한다", () => {
    const name = "가".repeat(60);
    expect(validateName(name)).toBe(name);
  });

  it("길이가 61자면 ValidationError를 던진다", () => {
    const name = "가".repeat(61);
    expect(() => validateName(name)).toThrow(ValidationError);
  });

  it("빈 문자열이면 ValidationError를 던진다", () => {
    expect(() => validateName("")).toThrow(ValidationError);
  });

  it("공백만 있는 문자열이면 ValidationError를 던진다", () => {
    expect(() => validateName("   ")).toThrow(ValidationError);
  });
});

describe("validatePrice", () => {
  it("0보다 크고 100_000_000 이하면 그대로 반환한다", () => {
    expect(validatePrice(1000)).toBe(1000);
  });

  it("0.01이면 통과한다", () => {
    expect(validatePrice(0.01)).toBe(0.01);
  });

  it("정확히 100_000_000이면 통과한다", () => {
    expect(validatePrice(100_000_000)).toBe(100_000_000);
  });

  it("100_000_000.01이면 ValidationError를 던진다", () => {
    expect(() => validatePrice(100_000_000.01)).toThrow(ValidationError);
  });

  it("0이면 ValidationError를 던진다", () => {
    expect(() => validatePrice(0)).toThrow(ValidationError);
  });

  it("음수면 ValidationError를 던진다", () => {
    expect(() => validatePrice(-1)).toThrow(ValidationError);
  });

  it("NaN이면 ValidationError를 던진다", () => {
    expect(() => validatePrice(NaN)).toThrow(ValidationError);
  });

  it("Infinity면 ValidationError를 던진다", () => {
    expect(() => validatePrice(Infinity)).toThrow(ValidationError);
  });
});
