"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store/useAppStore";

export function AppHydrator() {
  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  return null;
}
