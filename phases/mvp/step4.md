# Step 4: store-detail-shell

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md`
- `src/hooks/useStores.ts`, `src/components/ui/Modal.tsx`, `src/components/ui/ErrorBoundary.tsx` (step 3에서 생성됨)
- `src/app/page.tsx` (step 3에서 교체됨)

## 작업

1. `src/components/ui/Tabs.tsx`: 범용 탭 컴포넌트 (탭 목록과 활성 탭을 props로 받거나 내부에서 관리 — 자유롭게 설계).
2. `src/components/store-detail/StoreDetailTabs.tsx`: "장보기 리스트" / "가격 메모" 두 탭을 전환하는 UI. 기본 탭은 "장보기 리스트". 이 step에서는 각 탭의 실제 내용 대신 "다음 step에서 구현 예정" 수준의 placeholder를 렌더한다 (다음 두 step에서 실제 컴포넌트로 교체된다).
3. `src/app/stores/[storeId]/page.tsx`: URL의 `storeId`로 `useStores`에서 해당 가게를 찾는다. 존재하지 않으면 보드(`/`)로 리다이렉트한다. 존재하면 가게 이름과 `StoreDetailTabs`를 렌더한다. 이 파일은 라우트 파일이므로 로직은 최소화하고, 실제 렌더는 컴포넌트에 위임하는 얇은 wrapper로 유지한다.
4. 상세 화면에서 보드로 돌아가는 뒤로가기 네비게이션(링크 또는 버튼)을 추가한다.

테스트: 존재하지 않는 `storeId`로 접근 시 보드로 리다이렉트되는지, `StoreDetailTabs`에서 탭 전환이 정상 동작하는지, 기본 탭이 "장보기 리스트"인지.

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

- 장보기 리스트/가격 메모의 실제 CRUD 로직을 이 step에서 구현하지 마라. 이유: scope 최소화 — 다음 두 step에서 각각 다룬다.
- `app/stores/[storeId]/page.tsx`에 데이터 조회 이상의 UI 로직을 직접 작성하지 마라. 이유: ARCHITECTURE.md의 "app/는 라우트 파일만" 규칙.
- 기존 테스트를 깨뜨리지 마라.
