# Step 6: price-memo-tab

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/PRD.md` (핵심 기능 3: 가격 메모)
- `/docs/ADR.md` (ADR-003: 원자적 상품 등록)
- `src/lib/store/useAppStore.ts` (step 2)
- `src/components/ui/ConfirmDialog.tsx` (step 3)
- `src/components/store-detail/StoreDetailTabs.tsx` (step 4 — "가격 메모" 탭이 placeholder 상태임)

## 작업

1. `src/hooks/useProducts.ts`: `storeId`로 필터링된 `{ products, createProductWithFirstPrice, renameProduct, deleteProduct }`을 노출하는 셀렉터 훅.
2. `src/hooks/usePriceEntries.ts`: `productId`로 필터링되고 `recordedAt` 기준 최신순으로 정렬된 `{ entries, addPriceEntry, updatePriceEntryPrice, removePriceEntry }`을 노출하는 셀렉터 훅.
3. `src/components/store-detail/price-memo/ProductAddModal.tsx`: **상품명 + 첫 가격을 하나의 폼에서 함께 입력**받아 `createProductWithFirstPrice`를 호출한다 (ADR-003 — 절대 "상품명만 등록" 후 별도로 가격을 입력하는 2단계로 만들지 않는다).
4. `src/components/store-detail/price-memo/ProductRenameModal.tsx`: 기존 상품의 이름만 수정하는 폼.
5. `src/components/store-detail/price-memo/ProductListItem.tsx`, `ProductList.tsx`: 상품 목록을 렌더하고 클릭 시 선택 상태를 부모에 전달. 상품이 0개면 "상품을 등록해보세요" 빈 상태 표시. 상품 삭제 버튼 클릭 시 `ConfirmDialog`로 "가격 기록도 함께 삭제됩니다"를 확인한 뒤에만 `deleteProduct`를 호출한다.
6. `src/components/store-detail/price-memo/PriceEntryRow.tsx`, `PriceEntryList.tsx`: 선택된 상품의 가격 이력을 최신순으로 표시. 가격 기록이 0개면 "첫 가격을 기록해보세요" 빈 상태 표시. 각 기록은 가격 수정/삭제 가능(수정 시 `recordedAt`은 바뀌지 않음).
7. `src/components/store-detail/price-memo/PriceEntryAddForm.tsx`: 이미 등록된 상품에 새 가격만 입력해 `addPriceEntry`를 호출하는 폼.
8. `StoreDetailTabs.tsx`의 "가격 메모" 탭 placeholder를 위 컴포넌트들을 조합한 실제 화면으로 교체한다.

테스트: 신규 상품을 이름+가격으로 한 번에 등록(Product와 PriceEntry가 함께 생성됨을 확인), 기존 상품에 가격 추가, 가격 이력이 최신순으로 표시되는지, 상품 삭제 시 확인 다이얼로그가 뜨고 확인 후에만 삭제되는지, 가격 검증(0 이하/비정상 값 입력 시 에러).

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

- 가격 추이 그래프/차트 라이브러리를 추가하지 마라. 이유: PRD상 시각화는 이번 MVP 범위 밖이며, 데이터 모델만 대비하면 된다.
- 상품 등록을 "이름만 등록 → 별도로 가격 추가"의 2단계로 만들지 마라. 이유: ADR-003에 따라 반드시 한 화면에서 원자적으로 처리해야 한다.
- 상품 삭제 시 확인 다이얼로그 없이 바로 삭제하지 마라. 이유: 가격 기록이 캐스케이드로 함께 삭제되므로 실수 방지가 필요하다.
- 기존 테스트를 깨뜨리지 마라.
