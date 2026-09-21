# Step 1: data-layer-foundation

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md` (특히 ADR-004: 테스트 스택)
- `package.json`, `vitest.config.ts`, `src/app/layout.tsx` (step 0에서 생성됨)

이전 step에서 만들어진 프로젝트 설정을 확인하고, 그 위에 데이터 타입과 순수 유틸 함수를 쌓는다.

## 작업

1. `src/types/` 아래에 다음 타입을 정의한다 (이 파일들은 tdd-guard가 테스트 없이 작성 가능하도록 면제한다):
   - `category.ts`: `export type StoreCategory = "mart" | "hypermarket" | "convenience" | "market" | "butcher";`
   - `store.ts`: `Store { id, name, category, createdAt, updatedAt }`
   - `shoppingListItem.ts`: `ShoppingListItem { id, storeId, name, checked, createdAt, updatedAt }`
   - `product.ts`: `Product { id, storeId, name, createdAt, updatedAt }`
   - `priceEntry.ts`: `PriceEntry { id, productId, price, recordedAt, createdAt }` (`recordedAt`은 자동 기록되며 이후 수정되지 않는 필드임을 주석으로 명시)
   - `index.ts`: 위 타입들의 배럴 재export
2. `src/lib/id.ts`: `export function generateId(): string` — 내부적으로 `crypto.randomUUID()`를 호출한다. 테스트에서 mock할 수 있도록 반드시 별도 함수로 감싼다.
3. `src/lib/datetime.ts`: `export function nowIso(): string` — 내부적으로 `new Date().toISOString()`을 호출한다. 마찬가지로 mock 가능하도록 감싼다.
4. `src/lib/categoryIcons.ts`:
   - `CATEGORY_ICON_MAP: Record<StoreCategory, LucideIcon>` — mart→ShoppingBasket, hypermarket→ShoppingCart, convenience→Store, market→Carrot, butcher→Beef
   - `CATEGORY_LABEL_MAP: Record<StoreCategory, string>` — mart→"마트", hypermarket→"대형마트", convenience→"편의점", market→"시장", butcher→"정육점"
   - `getCategoryIcon(category: StoreCategory): LucideIcon`
   - `getCategoryLabel(category: StoreCategory): string`
5. `src/lib/validation.ts`:
   - `export class ValidationError extends Error {}`
   - `export function validateName(name: string): string` — trim 후 길이가 1~60자가 아니면 `ValidationError`를 throw, 통과하면 trim된 문자열을 반환한다.
   - `export function validatePrice(price: number): number` — `Number.isFinite(price)`이고 `0 < price <= 100_000_000`이 아니면 `ValidationError`를 throw, 통과하면 그대로 반환한다.

**반드시 지킬 규칙**: `validateName`/`validatePrice`는 실패 시 항상 `ValidationError`를 throw해야 한다. boolean 리턴이나 다른 에러 타입을 쓰지 마라 — 다음 step(app-store)의 모든 액션이 이 계약에 의존한다.

6. 각 `lib/` 파일에 대응하는 테스트를 tdd-guard 규칙에 따라 먼저 작성한다 (동일 디렉토리에 colocate): `id.test.ts`, `datetime.test.ts`, `categoryIcons.test.ts`, `validation.test.ts`. 특히 `validation.test.ts`는 경계값(정확히 60자, 61자, 0, 0.01, 100_000_000, 100_000_000.01)을 테스트한다.

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

- localStorage나 Zustand 스토어를 이 step에서 만들지 마라. 이유: scope 최소화 — 다음 step(app-store)에서 다룬다.
- `validation.ts` 외의 곳에서 이름/가격 검증 로직을 중복 구현하지 마라. 이유: 단일 진실 공급원을 유지해야 나중에 규칙이 바뀔 때 한 곳만 고치면 된다.
- 기존 테스트를 깨뜨리지 마라.
