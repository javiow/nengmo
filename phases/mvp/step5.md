# Step 5: shopping-list-tab

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/PRD.md` (핵심 기능 2: 장보기 리스트)
- `/docs/ARCHITECTURE.md`
- `src/lib/store/useAppStore.ts` (step 2)
- `src/components/store-detail/StoreDetailTabs.tsx` (step 4 — "장보기 리스트" 탭이 placeholder 상태임)

## 작업

1. `src/hooks/useShoppingList.ts`: `useAppStore`를 감싸 특정 `storeId`로 필터링된 `{ items, addItem, toggleItem, removeItem }`을 노출하는 셀렉터 훅.
2. `src/components/store-detail/shopping-list/ShoppingListItemRow.tsx`: 항목 이름 + 체크박스. 체크되면 취소선/흐림 스타일(Tailwind)을 적용하되 리스트에서 제거하지 않는다. 별도 삭제 버튼 제공.
3. `src/components/store-detail/shopping-list/ShoppingListAddForm.tsx`: 이름 입력 후 추가하는 폼. `validateName`이 던지는 `ValidationError`를 catch해 인라인 에러를 표시하고, 제출 중 버튼을 비활성화한다.
4. `src/components/store-detail/shopping-list/ShoppingList.tsx`: 위 컴포넌트들을 조합. 항목이 0개면 "살 것을 추가해보세요" 같은 빈 상태를 표시한다.
5. `StoreDetailTabs.tsx`의 "장보기 리스트" 탭 placeholder를 `ShoppingList`로 교체한다 (`storeId`를 prop으로 전달).

테스트: 항목 추가, 체크 시 취소선 스타일이 적용되고 리스트에 남는지, 삭제, 빈 이름 입력 시 에러 표시, 빈 상태 렌더.

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

- 체크된 항목을 리스트에서 자동으로 삭제하지 마라. 이유: PRD 요구사항상 체크는 취소선 표시로만 남아야 하며, 삭제는 별도 사용자 액션이어야 한다.
- 가격 메모 탭(상품/가격 기록)을 이 step에서 건드리지 마라. 이유: 다음 step에서 다룬다.
- 기존 테스트를 깨뜨리지 마라.
