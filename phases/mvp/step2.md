# Step 2: app-store

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` (데이터 흐름 / 상태 관리 섹션)
- `/docs/ADR.md` (ADR-002, ADR-005)
- `src/types/index.ts`, `src/lib/id.ts`, `src/lib/datetime.ts`, `src/lib/validation.ts` (step 1에서 생성됨)

이전 step에서 만든 타입과 순수 유틸을 사용해 이 step에서 실제 상태/영속성 계층을 만든다.

## 작업

`src/lib/store/useAppStore.ts`에 Zustand `persist` 미들웨어를 사용한 **단일 스토어**를 작성한다. 4개 엔티티(`stores`, `shoppingItems`, `products`, `priceEntries`)와 그 액션을 한 스토어에 모은다 — 캐스케이드 삭제가 여러 엔티티를 가로지르므로 스토어를 쪼개지 않는다.

State:
- `stores: Store[]`, `shoppingItems: ShoppingListItem[]`, `products: Product[]`, `priceEntries: PriceEntry[]`

Actions (시그니처, 내부 구현은 아래 "반드시 지킬 규칙"을 지키는 한 자유):
- `createStore(input: { name: string; category: StoreCategory }): Store`
- `updateStore(id: string, patch: { name?: string; category?: StoreCategory }): void`
- `deleteStore(id: string): void`
- `addShoppingItem(storeId: string, name: string): ShoppingListItem`
- `toggleShoppingItem(id: string): void`
- `removeShoppingItem(id: string): void`
- `createProductWithFirstPrice(storeId: string, name: string, price: number): Product`
- `renameProduct(id: string, name: string): void`
- `deleteProduct(id: string): void`
- `addPriceEntry(productId: string, price: number): PriceEntry`
- `updatePriceEntryPrice(id: string, price: number): void`
- `removePriceEntry(id: string): void`

**반드시 지킬 규칙**:
1. `deleteStore`는 해당 `storeId`의 `shoppingItems`, `products`, 그리고 그 products에 속한 `priceEntries`까지 모두 캐스케이드 삭제해야 한다.
2. `deleteProduct`는 해당 `productId`의 `priceEntries`를 모두 캐스케이드 삭제해야 한다.
3. `createProductWithFirstPrice`는 `Product` 생성과 첫 `PriceEntry` 생성을 하나의 `set()` 호출로 원자적으로 처리해야 한다 (ADR-003).
4. `updatePriceEntryPrice`는 `price`만 바꾸고 `recordedAt`은 절대 변경하지 않는다.
5. 이름/가격을 받는 모든 액션은 내부에서 `validateName`/`validatePrice`를 호출하고, 던져진 `ValidationError`를 캐치하지 않고 그대로 호출자에게 전파한다 (폼 컴포넌트가 다음 step들에서 catch한다).
6. `id`/`recordedAt`/`createdAt`/`updatedAt` 값은 반드시 `lib/id.ts`의 `generateId()`, `lib/datetime.ts`의 `nowIso()`를 통해서만 생성한다.

Persist 설정: `persist(storeCreator, { name: "nengmo:v1", storage: createJSONStorage(() => localStorage), skipHydration: true })`. `onRehydrateStorage`에서 파싱 실패를 대비해 방어하고, 실패 시 초기 상태를 유지하며 `console.warn`으로 로그만 남긴다.

**만들지 말 것** (ADR-005): localStorage 용량 초과(QuotaExceededError) 전용 처리, 프라이빗 브라우징 감지 및 인메모리 폴백 모드, 구버전 스키마 자동 마이그레이션/필터링. 아직 배포된 적 없는 프로토타입이라 이런 시나리오에 대한 방어는 지금 만들지 않는다.

테스트(`useAppStore.test.ts`, tdd-guard 규칙에 따라 먼저 작성): 특히 `deleteStore`/`deleteProduct`의 캐스케이드, `createProductWithFirstPrice`의 원자성, 검증 실패 시 상태가 변경되지 않고 에러가 전파되는지를 검증한다. 각 테스트 전 `useAppStore.setState(initialState, true)`로 스토어를 초기화한다.

## Acceptance Criteria

```bash
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- localStorage 용량 초과나 프라이빗 브라우징 대응 코드를 만들지 마라. 이유: ADR-005에 따라 MVP 범위 밖.
- 4개 엔티티를 여러 개의 Zustand 스토어로 쪼개지 마라. 이유: 캐스케이드 삭제가 한 스토어 안에서 원자적으로 일어나야 한다.
- UI 컴포넌트를 이 step에서 만들지 마라. 이유: scope 최소화 — 다음 step들에서 다룬다.
- 기존 테스트를 깨뜨리지 마라.
