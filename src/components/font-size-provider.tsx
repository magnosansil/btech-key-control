"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type FontScale = "normal" | "large" | "xlarge";

const FontSizeContext = createContext<{
  scale: FontScale;
  setScale: (s: FontScale) => void;
} | null>(null);

const STORAGE_KEY = "chavefacil-font-scale";

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [scale, setScaleState] = useState<FontScale>("normal");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as FontScale | null;
    if (saved) setScaleState(saved);
  }, []);

  const setScale = useCallback((s: FontScale) => {
    setScaleState(s);
    localStorage.setItem(STORAGE_KEY, s);
    document.documentElement.dataset.fontScale = s;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.fontScale = scale;
  }, [scale]);

  return (
    <FontSizeContext.Provider value={{ scale, setScale }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used within FontSizeProvider");
  return ctx;
}
