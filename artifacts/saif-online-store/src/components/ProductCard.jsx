import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCartStore, formatPrice } from "../store/cart";
import { useUiStore } from "../store/ui";

export default function ProductCard({ product, index = 0, featured = false }) {
  const openProduct = useCartStore((state) => state.openProduct);
  const addItem = useCartStore((state) => state.addItem);
  const recordView = useUiStore((state) => state.recordView);
  const [loaded, setLoaded] = useState(false);

  const ref = useRef(null);
  
  // Respect reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches : false;
  
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], prefersReducedMotion ? [0,0] : [2, -2]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], prefersReducedMotion ? [0,0] : [-3, 3]), { stiffness: 150, damping: 20 });

  const handleMove = (event) => {
    if (prefersReducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const open = () => {
    recordView(product.id);
    openProduct(product);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: Math.min((index % 4) * 0.05, 0.3) }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-soft transition-colors hover:border-neon/30 ${product.span ?? ""}`}
    >
      <button
        type="button"
        className="absolute inset-0 z-10 cursor-pointer rounded-[1.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-neon"
        aria-label={`Configure ${product.name}`}
        onClick={open}
      />
      
      <div className={`relative overflow-hidden bg-bg-deep ${featured ? "min-h-[20rem] flex-1" : "aspect-[4/3]"}`}>
        {!loaded && <div className="shimmer absolute inset-0 bg-bg-deep" />}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-surface/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-neon backdrop-blur-md">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-4 top-4 rounded-full bg-surface/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-subtle backdrop-blur-md">
            Out of stock
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col p-6">
        <h3 className={`font-serif text-ink ${featured ? "text-3xl" : "text-2xl"}`}>
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-light text-subtle line-clamp-2">{product.tagline}</p>
        
        <div className="mt-auto pt-6 flex items-end justify-between gap-4">
          <span className="font-serif text-lg text-ink">{formatPrice(product.price)}</span>
          <button
            type="button"
            disabled={!product.inStock}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              addItem(product);
            }}
            className="relative z-20 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-xs font-medium tracking-wide text-bg transition-colors hover:bg-neon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.inStock ? "Add to bag" : "Unavailable"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
