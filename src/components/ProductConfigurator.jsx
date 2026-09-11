import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Check,
  Star,
  Truck,
  ShieldCheck,
  Headphones,
  Watch,
  Tablet,
  Ear,
  Monitor,
  Smartphone,
  Keyboard,
  Plane,
  Minus,
  Plus,
} from "lucide-react";
import { useCartStore, formatPrice } from "../store/cart";
import MagneticButton from "./MagneticButton";

const icons = { Headphones, Watch, Tablet, Ear, Monitor, Smartphone, Keyboard, Plane };

export default function ProductConfigurator() {
  const product = useCartStore((state) => state.activeProduct);
  const closeProduct = useCartStore((state) => state.closeProduct);
  const addItem = useCartStore((state) => state.addItem);

  const [finish, setFinish] = useState(null);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setFinish(product.finishes?.[0] ?? null);
      setSize(product.sizes?.[0] ?? null);
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && closeProduct();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeProduct]);

  const Icon = product ? (icons[product.icon] ?? Headphones) : Headphones;
  const sizeIndex = product?.sizes?.indexOf(size ?? "") ?? 0;
  const unitPrice = product ? product.price + Math.max(sizeIndex, 0) * 60 : 0;

  const handleAdd = () => {
    if (!product) return;
    addItem(
      {
        id: `${product.id}-${finish?.id ?? "std"}-${(size ?? "one").toLowerCase()}`,
        name: product.name,
        price: unitPrice,
        tagline: `${finish?.name ?? "Standard"} · ${size ?? "One size"}`,
      },
      quantity,
    );
    closeProduct();
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProduct}
            className="fixed inset-0 z-[80] bg-bg/80 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-label={`Configure ${product.name}`}
              className="relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-line bg-surface/90 text-ink backdrop-blur-2xl md:grid-cols-2"
            >
              <button
                type="button"
                onClick={closeProduct}
                aria-label="Close product configurator"
                className="absolute right-4 top-4 z-10 rounded-full border border-line bg-bg/50 p-2 text-subtle backdrop-blur-xl transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>

              <div
                className={`relative flex min-h-[16rem] items-center justify-center bg-gradient-to-br ${product.accent}`}
              >
                <motion.div
                  key={finish?.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ color: finish?.swatch }}
                >
                  <Icon className="h-36 w-36 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                </motion.div>
                <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-line bg-bg/50 px-3 py-1.5 text-xs text-subtle backdrop-blur-xl">
                  <Star className="h-3.5 w-3.5 fill-neon text-neon" />
                  {product.rating} · {product.reviews.toLocaleString("en-US")} reviews
                </div>
              </div>

              <div className="p-7">
                <h2 className="text-2xl font-semibold tracking-tight text-ink">
                  {product.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-subtle">{product.description}</p>

                <div className="mt-6">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-subtle">
                    Finish
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {product.finishes?.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFinish(option)}
                        aria-label={option.name}
                        aria-pressed={finish?.id === option.id}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                          finish?.id === option.id
                            ? "border-neon scale-110"
                            : "border-line hover:border-neon/60"
                        }`}
                      >
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full"
                          style={{ backgroundColor: option.swatch }}
                        >
                          {finish?.id === option.id && (
                            <Check className="h-3.5 w-3.5 text-ink" />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-subtle">{finish?.name}</p>
                </div>

                <div className="mt-6">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-subtle">
                    Configuration
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes?.map((option, optionIndex) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSize(option)}
                        aria-pressed={size === option}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                          size === option
                            ? "border-neon/60 bg-neon/10 text-neon"
                            : "border-line bg-bg/40 text-subtle hover:border-neon/50"
                        }`}
                      >
                        {option}
                        {optionIndex > 0 && (
                          <span className="ml-1.5 text-subtle">+${optionIndex * 60}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
                  {product.specs?.map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-[10px] uppercase tracking-[0.15em] text-subtle">
                        {spec.label}
                      </dt>
                      <dd className="mt-1 text-xs font-medium text-ink">{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 rounded-full border border-line bg-bg/40 px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      aria-label="Decrease quantity"
                      className="rounded-full p-1.5 text-subtle transition-colors hover:text-ink"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold text-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                      aria-label="Increase quantity"
                      className="rounded-full p-1.5 text-subtle transition-colors hover:text-ink"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-2xl font-semibold text-ink">
                    {formatPrice(unitPrice * quantity)}
                  </p>
                </div>

                <MagneticButton
                  type="button"
                  onClick={handleAdd}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-neon hover:text-white"
                >
                  Add to bag
                </MagneticButton>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-subtle">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-neon" /> Free delivery over $500
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-neon" /> 3-year warranty
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
