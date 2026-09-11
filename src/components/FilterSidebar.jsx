import { motion } from "framer-motion";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { categories } from "../data/products";
import { formatPrice } from "../store/cart";

export default function FilterSidebar({ filters, setFilters, resultCount, maxPrice }) {
  const toggleCategory = (category) =>
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((entry) => entry !== category)
        : [...prev.categories, category],
    }));

  const reset = () =>
    setFilters({ categories: [], maxPrice, inStockOnly: false, sort: "featured" });

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-label="Product filters"
      className="h-fit rounded-[1.5rem] border border-line bg-surface/60 p-6 backdrop-blur-xl lg:sticky lg:top-24"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4 text-neon" /> Filters
        </h3>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-subtle transition-colors hover:text-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>
      <p className="mt-2 text-xs text-subtle">
        {resultCount} product{resultCount === 1 ? "" : "s"} available
      </p>

      <div className="mt-6">
        <span className="text-[11px] uppercase tracking-[0.22em] text-subtle">Category</span>
        <div className="mt-3 space-y-2">
          {categories.map((category) => {
            const checked = filters.categories.includes(category);
            return (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 shrink-0 accent-[var(--neon)]"
                />
                {category}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <span className="text-[11px] uppercase tracking-[0.22em] text-subtle">Max price</span>
        <input
          type="range"
          min={100}
          max={maxPrice}
          step={50}
          value={filters.maxPrice}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(event.target.value) }))
          }
          aria-label="Maximum price"
          className="mt-3 w-full accent-[var(--neon)]"
        />
        <div className="mt-1.5 flex justify-between text-xs text-subtle">
          <span>{formatPrice(100)}</span>
          <span className="font-semibold text-ink">{formatPrice(filters.maxPrice)}</span>
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-ink">
          In stock only
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, inStockOnly: event.target.checked }))
            }
            className="h-4 w-4 accent-[var(--neon)]"
          />
        </label>
      </div>

      <div className="mt-6">
        <label className="block text-[11px] uppercase tracking-[0.22em] text-subtle">
          Sort by
          <select
            value={filters.sort}
            onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
            className="mt-3 w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-neon"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </label>
      </div>
    </motion.aside>
  );
}
