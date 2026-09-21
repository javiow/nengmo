# Step 7: polish-responsive-empty-states

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/PRD.md` (디자인 섹션)
- `/docs/ARCHITECTURE.md`
- 지금까지 만들어진 `src/components/` 전체 (step 0~6에서 생성됨)

이 step은 새 기능을 추가하는 것이 아니라, 이미 만든 화면들을 마무리(polish)하는 단계다.

## 작업

1. **반응형 점검**: 375px 너비(모바일 기준) 화면에서 보드 그리드, 가게 상세 탭, 모든 모달/폼이 잘리거나 겹치지 않는지 Tailwind 클래스를 조정한다.
2. **빈 상태 일관성**: 가게 0개(`EmptyBoardState`), 장보기 리스트 0개, 상품 0개, 가격 기록 0개 — 4가지 빈 상태의 문구 톤과 스타일을 일관되게 다듬는다.
3. **XSS 방어 점검**: `dangerouslySetInnerHTML`, `eval`, 문자열 기반 `innerHTML` 조작이 코드베이스 어디에도 없는지 검색해 확인한다. 있다면 제거하고 일반 JSX 텍스트 렌더링으로 바꾼다.
4. **이중 제출 방지 점검**: `StoreFormModal`, `ShoppingListAddForm`, `ProductAddModal`, `ProductRenameModal`, `PriceEntryAddForm` 등 모든 생성/수정 폼이 제출 중 버튼을 비활성화하는지(`isSubmitting`) 확인하고, 빠진 곳이 있으면 추가한다.
5. **삭제 확인 다이얼로그 점검**: 가게 삭제와 상품 삭제 모두 `ConfirmDialog`를 거치는지 재확인한다.
6. `npm audit`을 다시 실행해 critical/high 취약점이 새로 생기지 않았는지 확인한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
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

- 새로운 기능(정렬, 검색, 필터, 가격 그래프 등)을 추가하지 마라. 이유: 이 step은 마무리 단계이지 기능 확장 단계가 아니다.
- 기존 컴포넌트의 파일 구조나 이름을 이유 없이 리팩터링하지 마라. 이유: 이 step의 목적은 다듬기(polish)이지 재설계가 아니다.
- 기존 테스트를 깨뜨리지 마라.
