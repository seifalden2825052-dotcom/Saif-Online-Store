import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import FilterSidebar from "./FilterSidebar";
import { products } from "../data/products";

const MAX_PRICE = Math.max(...products.map((product) => product.price));

export default function ProductGrid() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [],
    maxPrice: MAX_PRICE,
    inStockOnly: false,
    sort: "featured",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
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
    if (filters.sort === "rating") return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [filters]);

  const isBento = filters.sort === "featured" && !filters.categories.length;

  return (
    <section id="shop" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14 flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-neon">In stock now</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            The current lineup
          </h2>
          <p className="mt-4 max-w-xl text-subtle">
            Eight products, each with a per-unit measurement report, a 30-day return window and no
            restocking fee. Tap any product to configure finish and size.
          </p>
        </div>
        <span className="rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs text-subtle backdrop-blur-xl">
          Updated hourly from our Rotterdam warehouse
        </span>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          resultCount={loading ? products.length : visible.length}
          maxPrice={MAX_PRICE}
        />

        <div>
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product, index) => (
                <ProductSkeleton
                  key={product.id}
                  featured={index === 0}
                  span={index === 0 ? "sm:col-span-2 lg:row-span-2" : ""}
                />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-[1.5rem] border border-line bg-surface/60 p-12 text-center">
              <p className="font-semibold text-ink">No products match these filters</p>
              <p className="mt-2 text-sm text-subtle">
                Widen the price range or clear a category to see the full lineup again.
              </p>
            </div>
          ) : (
            <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((product, index) => {
                const featured = isBento && index === 0;
                return (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      span: featured ? "sm:col-span-2 lg:row-span-2" : "",
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
