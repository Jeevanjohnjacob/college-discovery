"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface CompareItem {
  id: string;
  name: string;
  slug: string;
}

interface CompareContextType {
  compareList: CompareItem[];
  addToCompare: (item: CompareItem) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  canAdd: boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

const MAX_COMPARE = 3;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<CompareItem[]>([]);

  const addToCompare = useCallback((item: CompareItem) => {
    setCompareList((prev) => {
      if (prev.find((c) => c.id === item.id)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareList((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const isInCompare = useCallback(
    (id: string) => compareList.some((c) => c.id === id),
    [compareList]
  );

  const clearCompare = useCallback(() => setCompareList([]), []);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        canAdd: compareList.length < MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
