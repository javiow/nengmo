# Step 0: project-setup

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/PRD.md`
- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`
- `/CLAUDE.md`

이 저장소는 현재 순수 스캐폴드 상태다 (`package.json`, `src/` 없음). 이 step에서 Next.js 프로젝트를 처음부터 구성한다.

## 작업

1. Next.js App Router + TypeScript strict 모드로 프로젝트를 초기화한다. `src/app` 디렉토리 구조를 사용하고, ARCHITECTURE.md의 디렉토리 구조(`src/app`, `src/components`, `src/hooks`, `src/lib`, `src/types`)를 그대로 따른다. 이 step에서는 `src/components`, `src/hooks`, `src/lib`, `src/types`는 빈 디렉토리(또는 `.gitkeep`)로만 두고 실제 파일은 다음 step들에서 만든다.
2. 의존성 설치:
   - `zustand`
   - `lucide-react`
   - `tailwindcss` (+ Next.js와 통합에 필요한 패키지)
   - devDependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `vite-tsconfig-paths` 또는 `@vitejs/plugin-react` (Next.js 공식 Vitest 가이드 기준)
3. Tailwind CSS를 설정하고 `src/app/globals.css`에 기본 지시어를 추가한다.
4. `vitest.config.ts`를 Next.js 공식 App Router + Vitest 가이드에 맞춰 작성한다 (jsdom 환경, React 플러그인). `setupFiles`에서 각 테스트 전 `localStorage.clear()`를 호출하도록 설정한다 (ARCHITECTURE.md "테스트 관련 유의사항" 참고).
5. `package.json`의 스크립트를 CLAUDE.md의 "명령어" 섹션과 일치시킨다: `dev`, `build`, `lint`, `test`.
6. `src/app/layout.tsx`, `src/app/page.tsx`를 Next.js 기본 템플릿 수준의 최소 placeholder로 생성한다 (실제 보드 UI는 이후 step에서 만든다).
7. `npm audit`을 실행해 critical/high 취약점이 있는지 확인한다. 있다면 보고만 하고, 이 step에서 억지로 고치려 하지 않는다.
8. `package-lock.json`을 커밋 대상에 포함한다.

## Acceptance Criteria

```bash
npm run build   # 컴파일 에러 없음
npm run lint    # 린트 에러 없음
npm run test    # (아직 테스트 파일이 없다면 0 tests로 통과)
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택(Next.js App Router, TypeScript strict, Tailwind, Zustand, lucide-react, Vitest)을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 (API 키, 외부 인증, 수동 설정 등) → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 이 step에서 보드/가게 상세 등 실제 기능 코드를 작성하지 마라. 이유: scope 최소화 원칙 — 다음 step들에서 레이어별로 만든다.
- `next.config`에 불필요한 실험적 옵션을 켜지 마라. 이유: MVP는 기본 설정으로 충분하고, 예기치 못한 빌드 이슈를 피해야 한다.
- 기존 테스트를 깨뜨리지 마라.
