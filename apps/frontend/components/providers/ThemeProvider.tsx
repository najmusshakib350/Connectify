"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export type FeedTheme = "light" | "dark";

type FeedThemeContextValue = {
  theme: FeedTheme;
  setTheme: (t: FeedTheme) => void;
  toggleTheme: () => void;
};

const FeedThemeContext = createContext<FeedThemeContextValue | null>(null);


export function FeedThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<FeedTheme>("light");

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, toggleTheme],
  );

  return (
    <FeedThemeContext.Provider value={value}>
      <div
        className={cn("feed-theme-scope", theme === "dark" && "dark")}
      >
        {children}
      </div>
    </FeedThemeContext.Provider>
  );
}

export const ThemeProvider = FeedThemeProvider;

export function useFeedTheme() {
  const ctx = useContext(FeedThemeContext);
  if (!ctx) {
    throw new Error("useFeedTheme must be used within FeedThemeProvider");
  }
  return ctx;
}
