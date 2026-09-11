import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { categories } from "../data/products";
import { formatPrice } from "../store/cart";

export default function FilterSidebar({ filters, setFilters, resultCount, maxPrice }) {
  const toggleCategory = (cat) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const clearFilters = () => {
    setFilters({ categories: [], maxPrice, inStockOnly: false, sort: "featured" });
  };

  const hasActiveFilters =
    filters.categories.length > 0 || filters.maxPrice < maxPrice || filters.inStockOnly;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-10"
    >
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2 text-ink">
          <SlidersHorizontal className="h-4 w-4" />
          <h3 className="font-serif text-xl">Refine</h3>
        </div>
        <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-subtle">
          {resultCount} {resultCount === 1 ? "piece" : "pieces"}
        </span>
      </div>

      <div className="space-y-5 border-b border-line pb-8">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
          Collection
        </h4>
        <div className="space-y-3">
          {categories.map((cat) => {
            const active = filters.categories.includes(cat);
            return (
              <label
                key={cat}
                className="group flex cursor-pointer items-center gap-3 text-sm transition-colors hover:text-neon"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleCategory(cat)}
                  aria-label={`Filter by ${cat}`}
                  className="peer sr-only"
                />
                <div
                  aria-hidden="true"
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                    active
                      ? "border-neon bg-neon text-white"
                      : "border-line bg-transparent group-hover:border-neon/50"
                  }`}
                >
                  {active && (
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      className="h-2.5 w-2.5 stroke-current stroke-[2]"
                    >
                      <path d="M3 7l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={active ? "font-medium text-ink" : "font-light text-subtle"}>
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 border-b border-line pb-8">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
            Ceiling
          </h4>
          <span className="font-serif text-sm text-ink">{formatPrice(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={maxPrice}
          step="50"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: parseInt(e.target.value, 10) }))
          }
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-neon outline-none"
        />
      </div>

      <div className="space-y-5 border-b border-line pb-8">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
          Sort by
        </h4>
        <select
          value={filters.sort}
          onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
          className="w-full cursor-pointer rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-ink outline-none transition-colors hover:border-neon focus:border-neon"
        >
          <option value="featured">Auren Edit</option>
          <option value="price-desc">Highest price first</option>
          <option value="price-asc">Lowest price first</option>
        </select>
      </div>

      <label className="group flex cursor-pointer items-center gap-3 text-sm transition-colors hover:text-neon">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, inStockOnly: event.target.checked }))
          }
          aria-label="Show only ready-to-ship products"
          className="peer sr-only"
        />
        <div
          aria-hidden="true"
          className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
            filters.inStockOnly
              ? "border-neon bg-neon text-white"
              : "border-line bg-transparent group-hover:border-neon/50"
          }`}
        >
          {filters.inStockOnly && (
            <svg
              viewBox="0 0 14 14"
              fill="none"
              className="h-2.5 w-2.5 stroke-current stroke-[2]"
            >
              <path d="M3 7l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className={filters.inStockOnly ? "font-medium text-ink" : "font-light text-subtle"}>
          Ready to ship
        </span>
      </label>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="mt-2 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle transition-colors hover:text-neon"
        >
          Clear filters
        </button>
      )}
    </motion.aside>
  );
}