import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowUpRight } from "lucide-react";
import { useUiStore } from "../store/ui";
import { useCartStore, formatPrice } from "../store/cart";
import { categories, products, trendingSearches } from "../data/products";
import { useOverlayA11y } from "../hooks/useOverlayA11y";

export default function SearchOverlay() {
  const isSearchOpen = useUiStore((state) => state.isSearchOpen);
  const closeSearch = useUiStore((state) => state.closeSearch);
  const openProduct = useCartStore((state) => state.openProduct);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const { overlayRef } = useOverlayA11y({
    isOpen: isSearchOpen,
    onClose: closeSearch,
    initialFocusRef: inputRef,
  });

  useEffect(() => {
    if (!isSearchOpen) setQuery("");
  }, [isSearchOpen]);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        useUiStore.getState().openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? products.filter(
        (p) =>
          [p.name, p.category, p.tagline, p.description]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(normalizedQuery)),
      )
    : [];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-dialog-title"
          tabIndex={-1}
          className="fixed inset-0 z-[100] flex flex-col bg-bg/95 backdrop-blur-2xl"
        >
          <header className="flex-none border-b border-line">
            <div className="mx-auto flex h-24 max-w-5xl items-center gap-6 px-6">
              <Search className="h-6 w-6 text-subtle" />
              <h2 id="search-dialog-title" className="sr-only">
                Search products
              </h2>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search collection..."
                aria-label="Search products"
                className="flex-1 bg-transparent font-serif text-3xl text-ink outline-none placeholder:text-subtle/40 sm:text-4xl"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-widest text-subtle transition-colors hover:text-ink"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={closeSearch}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface/50 text-subtle transition-all hover:bg-bg-deep hover:text-ink hover:border-neon"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </header>

          <div className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-6 py-12">
            {normalizedQuery ? (
              <>
                <div className="mb-8 flex items-center justify-between gap-4" aria-live="polite">
                  <p className="text-sm text-subtle">
                    {results.length} {results.length === 1 ? "result" : "results"} for{" "}
                    <span className="font-medium text-ink">“{query.trim()}”</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-xs font-semibold uppercase tracking-widest text-subtle transition-colors hover:text-neon"
                  >
                    Clear search
                  </button>
                </div>
                {results.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((product) => (
                      <motion.button
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                          closeSearch();
                          openProduct(product);
                        }}
                        className="group flex flex-col gap-4 rounded-[2rem] p-4 text-left transition-colors border border-transparent hover:border-line hover:bg-surface/80"
                      >
                        <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-bg-deep">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg/90 text-ink opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </div>
                        <div>
                          <p className="font-serif text-xl text-ink">{product.name}</p>
                          <p className="mt-1 text-sm font-light text-subtle">{product.tagline}</p>
                          <p className="mt-2 text-sm font-medium text-ink">{formatPrice(product.price)}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Search className="h-12 w-12 text-subtle/30" />
                    <p className="mt-6 font-serif text-3xl text-ink">No results found</p>
                    <p className="mt-3 text-sm font-light text-subtle">
                      Try checking the spelling or searching for a different term.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="grid gap-12 sm:grid-cols-2">
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
                    Trending Searches
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {trendingSearches.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => setQuery(term)}
                          className="group flex items-center gap-3 text-lg font-light text-ink transition-colors hover:text-neon"
                        >
                          <Search className="h-4 w-4 text-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
                    Categories
                  </h3>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setQuery(cat)}
                        className="rounded-full border border-line bg-surface/50 px-5 py-2.5 text-sm font-medium transition-colors hover:border-neon hover:text-neon"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}