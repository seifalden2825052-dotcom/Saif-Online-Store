import { create } from "zustand";

export const useUiStore = create((set) => ({
  isSearchOpen: false,
  query: "",
  recentIds: [],

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false, query: "" }),
  setQuery: (query) => set({ query }),

  recordView: (id) =>
    set((state) => ({
      recentIds: [id, ...state.recentIds.filter((entry) => entry !== id)].slice(0, 4),
    })),
}));
