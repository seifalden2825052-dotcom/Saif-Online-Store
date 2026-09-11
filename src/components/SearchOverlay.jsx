import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, TrendingUp, Clock, ArrowUpRight } from "lucide-react";
import { products, trendingSearches } from "../data/products";
import { useUiStore } from "../store/ui";
import { useCartStore, formatPrice } from "../store/cart";

export default function SearchOverlay() {
  const isSearchOpen = useUiStore((state) => state.isSearchOpen);
  const closeSearch = useUiStore((state) => state.closeSearch);
  const query = useUiStore((state) => state.query);
  const setQuery = useUiStore((state) => state.setQuery);
  const recentIds = useUiStore((state) => state.recentIds);
  const openProduct = useCartStore((state) => state.openProduct);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && closeSearch();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSearch]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return products.filter((product) =>
      `${product.name} ${product.tagline} ${product.category}`.toLowerCase().includes(term),
    );
  }, [query]);

  const recentProducts = recentIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  const select = (product) => {
    closeSearch();
    openProduct(product);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          role="dialog"
          aria-label="Search AUREN"
          className="fixed inset-0 z-[100] overflow-y-auto bg-bg/85 backdrop-blur-2xl"
        >
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-70" />

          <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[0.35em] text-subtle">
                Search AUREN
              </span>
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/60 text-ink transition-colors hover:border-neon/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex items-center gap-4 border-b border-line pb-5"
            >
              <Search className="h-6 w-6 shrink-0 text-neon" />
              {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Headphones, ultrawide, titanium phone…"
                aria-label="Search products"
                className="w-full bg-transparent text-2xl font-medium tracking-tight text-ink outline-none placeholder:text-subtle/60 sm:text-4xl"
              />
            </motion.div>

            {query.trim() ? (
              <div className="mt-8">
                <h2 className="text-[11px] uppercase tracking-[0.28em] text-subtle">
                  {results.length} result{results.length === 1 ? "" : "s"}
                </h2>
                <ul className="mt-4 space-y-2">
                  {results.map((product, index) => (
                    <motion.li
                      key={product.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                    >
                      <button
                        type="button"
                        onClick={() => select(product)}
                        className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-surface/60 p-3 text-left transition-colors hover:border-neon/50"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-ink">
                            {product.name}
                          </span>
                          <span className="block truncate text-sm text-subtle">
                            {product.tagline}
                          </span>
                        </span>
                        <span className="whitespace-nowrap font-semibold text-ink">
                          {formatPrice(product.price)}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:text-neon" />
                      </button>
                    </motion.li>
                  ))}
                  {results.length === 0 && (
                    <li className="rounded-2xl border border-line bg-surface/60 p-6 text-sm text-subtle">
                      No products match “{query}”. Try “audio”, “display” or “drone”.
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                <div>
                  <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-subtle">
                    <TrendingUp className="h-3.5 w-3.5 text-neon" /> Trending searches
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {trendingSearches.map((term, index) => (
                      <motion.li
                        key={term}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.06 + index * 0.05 }}
                      >
                        <button
                          type="button"
                          onClick={() => setQuery(term)}
                          className="w-full rounded-xl border border-transparent px-3 py-2.5 text-left text-lg font-medium text-ink transition-colors hover:border-line hover:bg-surface/60"
                        >
                          {term}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-subtle">
                    <Clock className="h-3.5 w-3.5 text-neon" /> Recent views
                  </h2>
                  {recentProducts.length === 0 ? (
                    <p className="mt-4 rounded-2xl border border-line bg-surface/60 p-5 text-sm text-subtle">
                      Nothing viewed yet. Open a product and it shows up here.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {recentProducts.map((product) => (
                        <li key={product.id}>
                          <button
                            type="button"
                            onClick={() => select(product)}
                            className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface/60 p-2.5 text-left transition-colors hover:border-neon/50"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                              className="h-11 w-11 rounded-lg object-cover"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-ink">
                                {product.name}
                              </span>
                              <span className="block text-xs text-subtle">
                                {formatPrice(product.price)}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
