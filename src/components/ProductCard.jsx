import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, ArrowUpRight } from "lucide-react";
import { useCartStore, formatPrice } from "../store/cart";
import { useUiStore } from "../store/ui";
import MagneticButton from "./MagneticButton";

export default function ProductCard({ product, index = 0, featured = false }) {
  const openProduct = useCartStore((state) => state.openProduct);
  const addItem = useCartStore((state) => state.addItem);
  const recordView = useUiStore((state) => state.recordView);
  const [loaded, setLoaded] = useState(false);

  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMove = (event) => {
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
    <motion.article
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onClick={open}
      data-cursor="hover"
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.06 }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface/60 shadow-soft backdrop-blur-xl transition-all duration-300 hover:border-neon/50 hover:shadow-lift ${product.span ?? ""}`}
    >
      <div
        className={`relative overflow-hidden bg-bg-deep ${featured ? "min-h-[18rem] flex-1" : "aspect-4/3"}`}
      >
        {!loaded && <div className="shimmer absolute inset-0 bg-bg-deep" />}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {product.badge && (
          <span className="absolute left-5 top-5 rounded-full border border-line bg-bg/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neon backdrop-blur-xl">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-5 top-5 rounded-full border border-line bg-bg/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle backdrop-blur-xl">
            Backorder
          </span>
        )}
        <span className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg/70 text-ink opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="relative flex flex-col p-6">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-subtle">
          <Star className="h-3.5 w-3.5 fill-neon text-neon" />
          {product.rating}
          <span className="opacity-40">·</span>
          {product.reviews.toLocaleString("en-US")} reviews
        </div>
        <h3
          className={`mt-3 font-semibold tracking-tight text-ink ${featured ? "text-2xl" : "text-lg"}`}
        >
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm text-subtle">{product.tagline}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-xl font-semibold text-ink">{formatPrice(product.price)}</p>
          <MagneticButton
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              addItem(product);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-bg transition-colors hover:bg-neon hover:text-white"
          >
            Add to cart
          </MagneticButton>
        </div>
      </div>
    </motion.article>
  );
}
