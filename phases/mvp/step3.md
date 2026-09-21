# Step 3: board-store-crud

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md`
- `/docs/PRD.md` (핵심 기능 1: 가게 보드)
- `src/lib/store/useAppStore.ts` (step 2에서 생성됨)
- `src/lib/categoryIcons.ts`, `src/lib/validation.ts` (step 1에서 생성됨)

## 작업

1. `src/hooks/useStores.ts`: `useAppStore`를 감싸는 얇은 셀렉터 훅. `{ stores, createStore, updateStore, deleteStore }` 형태로 노출한다.
2. `src/components/ui/Modal.tsx`: 범용 모달 (열림/닫힘, children을 받는 형태로 자유롭게 설계).
3. `src/components/ui/ConfirmDialog.tsx`: 확인/취소 버튼이 있는 확인 다이얼로그. `message` prop으로 경고 문구를 받는다.
4. `src/components/ui/ErrorBoundary.tsx`: React Error Boundary. 렌더링 중 예외를 잡으면 "문제가 발생했습니다. 새로고침 해주세요" 정도의 문구만 표시한다. 별도의 "데이터 초기화" 등 복구 UI는 만들지 않는다 (ADR-005).
5. `src/components/board/StoreCard.tsx`: `getCategoryIcon`/`getCategoryLabel`로 카테고리 아이콘·라벨을 표시, 이름 표시, 클릭 시 `/stores/[storeId]`로 이동(다음 step에서 그 라우트가 만들어짐), 메뉴에서 수정/삭제 트리거.
6. `src/components/board/StoreFormModal.tsx`: 이름 입력 + 카테고리 5종 선택. `initialValue?: Store` prop으로 생성/수정을 겸용한다. 제출 중에는 버튼을 비활성화하고(`isSubmitting`), `validateName`이 던지는 `ValidationError`를 catch해 인라인 에러 메시지를 표시한다.
7. `src/components/board/EmptyBoardState.tsx`: 가게가 0개일 때 안내 문구 + "가게 추가" CTA 버튼.
8. `src/components/board/StoreBoard.tsx`: 위 컴포넌트들을 조합해 반응형 그리드로 렌더링(모바일 우선). 삭제 버튼 클릭 시 `ConfirmDialog`로 "리스트/상품/가격기록도 함께 삭제됩니다"를 확인한 뒤에만 `deleteStore`를 호출한다.
9. `src/app/layout.tsx`: 최상위 자식을 `ErrorBoundary`로 감싼다. 클라이언트 컴포넌트에서 `useEffect`로 `useAppStore.persist.rehydrate()`를 한 번 호출해 하이드레이션을 완료시킨다.
10. `src/app/page.tsx`: `StoreBoard`를 import해 렌더링만 하는 얇은 wrapper로 교체한다.

테스트: `StoreFormModal.test.tsx`(빈 이름/61자 이름 시 에러 표시, 연타해도 중복 제출 안 됨), `StoreCard.test.tsx`, `StoreBoard.test.tsx`(빈 상태 렌더, 생성 후 카드 표시, 삭제 확인 다이얼로그 흐름).

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

- 가게 상세 화면(탭, 장보기 리스트, 가격 메모)을 이 step에서 만들지 마라. 이유: scope 최소화 — 다음 step들에서 다룬다.
- `app/page.tsx`나 `app/layout.tsx`에 UI 로직/마크업을 직접 작성하지 마라. 이유: ARCHITECTURE.md의 "app/는 라우트 파일만" 규칙과 tdd-guard 면제 경계를 지켜야 한다.
- 기존 테스트를 깨뜨리지 마라.
