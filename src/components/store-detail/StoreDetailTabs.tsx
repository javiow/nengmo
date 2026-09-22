"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { ShoppingList } from "./shopping-list/ShoppingList";

const TABS = [
  { id: "shopping-list", label: "장보기 리스트" },
  { id: "price-memo", label: "가격 메모" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface StoreDetailTabsProps {
  storeId: string;
}

export function StoreDetailTabs({ storeId }: StoreDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("shopping-list");

  return (
    <div>
      <Tabs
        tabs={[...TABS]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />
      <div className="p-4">
        {activeTab === "shopping-list" ? (
          <ShoppingList storeId={storeId} />
        ) : (
          <p className="text-sm text-gray-500">
            가격 메모는 다음 step에서 구현 예정입니다.
          </p>
        )}
      </div>
    </div>
  );
}
