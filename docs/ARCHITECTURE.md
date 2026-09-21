# 아키텍처

## 디렉토리 구조
```
src/
├── app/                # 라우트 파일만 (page.tsx/layout.tsx/loading.tsx/error.tsx/not-found.tsx)
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                    # 보드 화면 (얇은 wrapper)
│   └── stores/[storeId]/page.tsx   # 가게 상세 화면 (얇은 wrapper)
├── components/
│   ├── board/          # StoreBoard, StoreCard, StoreFormModal, EmptyBoardState
│   ├── store-detail/
│   │   ├── shopping-list/  # ShoppingList, ShoppingListItemRow, ShoppingListAddForm
│   │   └── price-memo/     # ProductList, ProductListItem, ProductAddModal,
│   │                       # ProductRenameModal, PriceEntryList, PriceEntryRow, PriceEntryAddForm
│   └── ui/              # Modal, ConfirmDialog, Tabs, ErrorBoundary
├── hooks/               # useStores, useShoppingList(storeId), useProducts(storeId), usePriceEntries(productId)
├── lib/
│   ├── id.ts            # crypto.randomUUID() 래퍼 (테스트에서 mock 가능하게)
│   ├── datetime.ts      # new Date().toISOString() 래퍼
│   ├── categoryIcons.ts # 카테고리 → lucide-react 아이콘/라벨 매핑
│   ├── validation.ts    # 이름/가격 검증 순수 함수
│   └── store/useAppStore.ts  # Zustand 단일 스토어 (persist 미들웨어)
└── types/               # category, store, shoppingListItem, product, priceEntry, index
```

`app/` 아래에는 라우트 파일 외의 실제 컴포넌트를 두지 않는다 — `page.tsx`는 `components/`의 컴포넌트를 import해 렌더링만 하는 wrapper로 유지한다(tdd-guard 훅이 라우트 파일만 테스트를 면제하기 때문).

## 패턴
- 데이터가 전부 client-side(localStorage)이므로 `components/` 하위는 대부분 `"use client"`.
- 프레젠테이션 컴포넌트(`StoreCard`, `ShoppingListItemRow`, `PriceEntryRow` 등)는 props(데이터 + 콜백)만 받는 순수 컴포넌트로 유지 — localStorage/스토어를 직접 참조하지 않는다.
- 모달/폼은 제출 중 버튼을 비활성화(`isSubmitting`)해 이중 제출을 막고, 검증 실패 시 인라인 에러를 표시한다.
- 캐스케이드가 발생하는 삭제(가게 삭제, 상품 삭제)는 `ConfirmDialog`로 한 번 더 확인한다.

## 데이터 흐름
```
사용자 입력 (폼/버튼)
  → 컴포넌트가 useAppStore 액션 호출 (예: createStore, addPriceEntry)
  → 액션이 lib/validation.ts로 검증 (실패 시 ValidationError throw → 폼에서 catch)
  → 검증 통과 시 Zustand set()으로 상태 갱신
  → persist 미들웨어가 자동으로 localStorage에 동기화
  → 구독 중인 모든 컴포넌트가 자동 리렌더 (hooks/의 셀렉터 래퍼를 통해)
```

## 상태 관리
- **Zustand 단일 스토어** (`lib/store/useAppStore.ts`) + `persist` 미들웨어로 `stores`, `shoppingItems`, `products`, `priceEntries` 4개 배열과 그 액션을 한곳에서 관리한다. 캐스케이드 삭제처럼 엔티티를 가로지르는 연산이 있어 스토어를 쪼개지 않는다.
- `hooks/`는 `useAppStore`를 감싸는 얇은 셀렉터 래퍼로, storeId/productId로 필터링된 배열을 컴포넌트에 내려준다. Zustand가 구독을 자동 처리하므로 여러 컴포넌트가 동시에 같은 훅을 호출해도 상태가 어긋나지 않는다.
- Next.js는 서버에서 먼저 렌더링하므로 `persist`가 localStorage를 읽기 전 하이드레이션 불일치가 날 수 있다 — `skipHydration: true` + 루트 클라이언트 컴포넌트의 `useEffect`에서 `useAppStore.persist.rehydrate()`로 방어한다.
- 저장된 JSON이 손상되어 파싱에 실패하면 `onRehydrateStorage`에서 잡아 빈 상태로 조용히 초기화한다(`console.warn` 로그만 남김).
