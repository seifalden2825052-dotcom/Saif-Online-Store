import { useEffect } from "react";
import { create } from "zustand";

const STORAGE_KEY = "auren-theme";

const readInitial = () => {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
};

export const useThemeStore = create((set, get) => ({
  theme: "dark",
  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
      document.documentElement.style.colorScheme = theme;
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        /* storage unavailable */
      }
    }
    set({ theme });
  },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
}));

/** Syncs the store with the class the inline boot script already applied. */
export function useThemeSync() {
  const setTheme = useThemeStore((state) => state.setTheme);
  useEffect(() => {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    setTheme(stored === "light" || stored === "dark" ? stored : readInitial());
  }, [setTheme]);
}
