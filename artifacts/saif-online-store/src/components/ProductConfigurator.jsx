import { useEffect, useRef, useState } from "react";
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
import { useCartStore, formatPrice, MAX_ITEM_QUANTITY } from "../store/cart";
import MagneticButton from "./MagneticButton";
import { useOverlayA11y } from "../hooks/useOverlayA11y";

const icons = { Headphones, Watch, Tablet, Ear, Monitor, Smartphone, Keyboard, Plane };

export default function ProductConfigurator() {
  const product = useCartStore((state) => state.activeProduct);
  const closeProduct = useCartStore((state) => state.closeProduct);
  const addItem = useCartStore((state) => state.addItem);

  const [finish, setFinish] = useState(null);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const closeButtonRef = useRef(null);
  const { overlayRef } = useOverlayA11y({
    isOpen: Boolean(product),
    onClose: closeProduct,
    initialFocusRef: closeButtonRef,
  });

  useEffect(() => {
    if (product) {
      setFinish(product.finishes?.[0] ?? null);
      setSize(product.sizes?.[0] ?? null);
      setQuantity(1);
    }
  }, [product]);

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
        image: product.image,
        variant: {
          finish: finish?.name ?? "Standard",
          size: size ?? "One size",
        },
      },
      Math.min(quantity, MAX_ITEM_QUANTITY),
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
            className="fixed inset-0 z-[80] bg-bg/90 backdrop-blur-xl"
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8">
            <motion.div
              ref={overlayRef}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-dialog-title"
              tabIndex={-1}
              className="relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-line bg-surface/80 shadow-lift backdrop-blur-2xl"
            >
              <button
                type="button"
                onClick={closeProduct}
                ref={closeButtonRef}
                aria-label="Close product details"
                className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bg/80 text-subtle backdrop-blur-md transition-colors hover:bg-bg hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid lg:grid-cols-[1.2fr_1fr]">
                <div className="relative aspect-square lg:aspect-auto">
                  <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-line bg-bg/80 px-3.5 py-1.5 backdrop-blur-md">
                    <Icon className="h-4 w-4 text-neon" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
                      {product.category}
                    </span>
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent lg:hidden" />
                </div>

                <div className="flex flex-col p-8 sm:p-10 lg:p-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-subtle">
                      <Star className="h-3 w-3 fill-neon text-neon" />
                      <span className="font-medium text-ink">{product.rating}</span>
                      <span className="opacity-40 ml-1">·</span>
                      <span className="ml-1">{product.reviews.toLocaleString()} reviews</span>
                    </div>

                    <h2
                      id="product-dialog-title"
                      className="mt-4 font-serif text-4xl text-ink sm:text-5xl"
                    >
                      {product.name}
                    </h2>
                    <p className="mt-4 text-sm font-light leading-relaxed text-subtle">
                      {product.description}
                    </p>

                    <div className="mt-10 grid gap-8 sm:grid-cols-2">
                      {product.finishes && (
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
                            Finish — <span className="text-ink">{finish?.name}</span>
                          </span>
                          <div className="mt-4 flex flex-wrap gap-3">
                            {product.finishes.map((f) => (
                              <button
                                type="button"
                                key={f.id}
                                onClick={() => setFinish(f)}
                                aria-label={`Select ${f.name} finish`}
                                aria-pressed={finish?.id === f.id}
                                className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                                  finish?.id === f.id
                                    ? "ring-2 ring-neon ring-offset-2 ring-offset-bg"
                                    : "ring-1 ring-line hover:ring-neon/50"
                                }`}
                                style={{ backgroundColor: f.swatch }}
                              >
                                {finish?.id === f.id && (
                                  <Check className="h-4 w-4 text-white drop-shadow-md mix-blend-difference" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.sizes && (
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
                            Specification
                          </span>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {product.sizes.map((s) => (
                              <button
                                type="button"
                                key={s}
                                onClick={() => setSize(s)}
                                aria-pressed={size === s}
                                className={`rounded-xl border px-4 py-2 text-sm transition-all ${
                                  size === s
                                    ? "border-neon bg-neon text-white shadow-soft"
                                    : "border-line bg-surface/50 text-subtle hover:border-neon/50 hover:text-ink"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-10 border-t border-line pt-8">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
                        Key Details
                      </span>
                      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                        {product.specs?.map((spec) => (
                          <div key={spec.label}>
                            <dt className="text-[10px] uppercase tracking-wider text-subtle">
                              {spec.label}
                            </dt>
                            <dd className="mt-1 text-sm font-medium text-ink">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-serif text-3xl text-ink">{formatPrice(unitPrice * quantity)}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-subtle">
                          <Truck className="h-3 w-3" /> Demo fulfillment preview
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface/50 p-1">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-subtle transition-colors hover:bg-bg hover:text-ink"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-ink">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(Math.min(MAX_ITEM_QUANTITY, quantity + 1))
                          }
                          aria-label="Increase quantity"
                          disabled={quantity >= MAX_ITEM_QUANTITY}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-subtle transition-colors hover:bg-bg hover:text-ink"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <MagneticButton
                      type="button"
                      onClick={handleAdd}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-semibold tracking-wide text-bg transition-colors hover:bg-neon hover:text-white"
                    >
                      Add {quantity} to bag — {formatPrice(unitPrice * quantity)}
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}