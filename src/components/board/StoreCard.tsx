"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { getCategoryIcon, getCategoryLabel } from "@/lib/categoryIcons";
import type { Store } from "@/types";

interface StoreCardProps {
  store: Store;
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
}

export function StoreCard({ store, onEdit, onDelete }: StoreCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Icon = getCategoryIcon(store.category);

  return (
    <div className="relative rounded-lg border border-gray-200 p-4 shadow-sm">
      <Link href={`/stores/${store.id}`} className="block">
        {/* eslint-disable-next-line react-hooks/static-components -- getCategoryIcon은 카테고리별 고정 아이콘 참조를 반환하는 조회 함수이며 새 컴포넌트를 생성하지 않는다 */}
        <Icon className="mb-2 h-6 w-6 text-gray-600" aria-hidden="true" />
        <p className="font-medium text-gray-900">{store.name}</p>
        <p className="text-xs text-gray-500">
          {getCategoryLabel(store.category)}
        </p>
      </Link>

      <button
        type="button"
        aria-label="가게 메뉴"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="absolute right-2 top-2 rounded p-1 hover:bg-gray-100"
      >
        <MoreVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-2 top-9 z-10 rounded border border-gray-200 bg-white shadow-md">
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onEdit(store);
            }}
            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
          >
            수정
          </button>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onDelete(store);
            }}
            className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
