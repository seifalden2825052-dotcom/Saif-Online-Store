import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import FilterSidebar from "./FilterSidebar";
import { products } from "../data/products";

const MAX_PRICE = Math.max(...products.map((product) => product.price));

export default function ProductGrid() {
  const [filters, setFilters] = useState({
    categories: [],
    maxPrice: MAX_PRICE,
    inStockOnly: false,
    sort: "featured",
  });

  // Listen for category events from Navbar or other components
  useEffect(() => {
    const handleCategory = (e) => {
      const category = e.detail;
      setFilters((prev) => ({
        ...prev,
        categories: [category],
      }));
      // Scroll to shop smoothly
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("auren:category", handleCategory);
    return () => window.removeEventListener("auren:category", handleCategory);
  }, []);

  const visible = useMemo(() => {
    const list = products.filter((product) => {
      if (filters.categories.length && !filters.categories.includes(product.category)) return false;
      if (product.price > filters.maxPrice) return false;
      if (filters.inStockOnly && !product.inStock) return false;
      return true;
    });

    if (filters.sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [filters]);

  const isBento = filters.sort === "featured" && !filters.categories.length;

  return (
    <section id="shop" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-line pb-8"
      >
        <div className="max-w-xl">
          <h2 className="font-serif text-4xl font-normal tracking-tight text-ink sm:text-5xl">
            The Edition
          </h2>
          <p className="mt-4 text-base font-light text-subtle sm:text-lg">
            Considered objects for sound, sight, movement and focus. Transparent specifications.
          </p>
        </div>
      </motion.div>

      <details className="group mb-6 rounded-2xl border border-line bg-surface/40 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-ink">
          <span>Filter and sort</span>
          <span className="rounded-full bg-bg-deep px-2.5 py-1 text-[11px] font-medium text-subtle">
            {visible.length} pieces
          </span>
        </summary>
        <div className="border-t border-line p-5">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            resultCount={visible.length}
            maxPrice={MAX_PRICE}
          />
        </div>
      </details>

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr] xl:grid-cols-[18rem_1fr]">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            resultCount={visible.length}
            maxPrice={MAX_PRICE}
          />
        </div>

        <div className="min-h-[50vh]">
          {visible.length === 0 ? (
            <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-line bg-surface/30 p-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg-deep text-subtle">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </span>
              <p className="mt-4 font-serif text-xl text-ink">No objects match your criteria</p>
              <button
                onClick={() => setFilters({ categories: [], maxPrice: MAX_PRICE, inStockOnly: false, sort: "featured" })}
                className="mt-6 rounded-full border border-line bg-bg px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-neon hover:text-neon"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((product, index) => {
                const featured = isBento && index === 0;
                return (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      span: featured ? "sm:col-span-2 xl:row-span-2" : "",
                    }}
                    index={index}
                    featured={featured}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
