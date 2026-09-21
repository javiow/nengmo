# 프로젝트: 냉모(nengmo) — 장보기 리스트 관리

## 기술 스택
- Next.js (App Router)
- TypeScript strict mode
- Tailwind CSS
- Zustand + persist 미들웨어 (브라우저 localStorage 저장, 서버/DB 없음)
- lucide-react (아이콘)
- Vitest + @testing-library/react + jsdom (테스트)

## 아키텍처 규칙
- CRITICAL: `app/` 디렉토리에는 `page.tsx`/`layout.tsx`/`loading.tsx`/`error.tsx`/`not-found.tsx` 같은 라우트 파일만 둔다. 실제 UI 로직과 마크업은 반드시 `components/`로 분리한다 (tdd-guard 훅이 라우트 파일만 테스트를 면제하므로, 이 구조를 지켜야 테스트 우선 작성 흐름이 깨지지 않는다).
- CRITICAL: 데이터는 `lib/store/useAppStore.ts`의 Zustand 단일 스토어와 `persist` 미들웨어를 통해서만 다룬다. 로그인 기능이 추가되기 전까지 서버 API 라우트나 외부 DB를 새로 만들지 않는다.
- 컴포넌트는 `components/`, 타입은 `types/`, 순수 유틸/검증/스토어는 `lib/`, 화면 단위 데이터 연결 훅은 `hooks/`에 둔다.
- 캐스케이드 삭제가 발생하는 동작(가게 삭제, 상품 삭제)은 반드시 확인 다이얼로그를 거친 뒤 실행한다.

## 개발 프로세스
- CRITICAL: 새 기능 구현 시 반드시 테스트를 먼저 작성하고, 테스트가 통과하는 구현을 작성할 것 (TDD)
- 커밋 메시지는 conventional commits 형식을 따를 것 (feat:, fix:, docs:, refactor:)

## 명령어
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm run test     # 테스트
