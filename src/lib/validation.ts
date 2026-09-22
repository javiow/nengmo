export class ValidationError extends Error {}

export function validateName(name: string): string {
  const trimmed = name.trim();

  if (trimmed.length < 1 || trimmed.length > 60) {
    throw new ValidationError("이름은 1자 이상 60자 이하여야 합니다.");
  }

  return trimmed;
}

export function validatePrice(price: number): number {
  if (!Number.isFinite(price) || price <= 0 || price > 100_000_000) {
    throw new ValidationError(
      "가격은 0보다 크고 100,000,000 이하여야 합니다.",
    );
  }

  return price;
}
