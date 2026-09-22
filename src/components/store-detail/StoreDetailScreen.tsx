"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useStores } from "@/hooks/useStores";
import { useAppStore } from "@/lib/store/useAppStore";
import { StoreDetailTabs } from "./StoreDetailTabs";

interface StoreDetailScreenProps {
  storeId: string;
}

export function StoreDetailScreen({ storeId }: StoreDetailScreenProps) {
  const router = useRouter();
  const { stores } = useStores();
  const store = stores.find((s) => s.id === storeId);
  const [hasHydrated, setHasHydrated] = useState(() =>
    useAppStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (hasHydrated) {
      return;
    }
    return useAppStore.persist.onFinishHydration(() => setHasHydrated(true));
  }, [hasHydrated]);

  useEffect(() => {
    if (hasHydrated && !store) {
      router.replace("/");
    }
  }, [hasHydrated, store, router]);

  if (!store) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        가게 보드로
      </Link>
      <h1 className="mb-4 text-xl font-semibold">{store.name}</h1>
      <StoreDetailTabs storeId={store.id} />
    </div>
  );
}
