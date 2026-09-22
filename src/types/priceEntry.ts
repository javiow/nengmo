export interface PriceEntry {
  id: string;
  productId: string;
  price: number;
  /** 최초 기록 시점에 자동으로 설정되며, 이후 수정되지 않는다. */
  recordedAt: string;
  createdAt: string;
}
