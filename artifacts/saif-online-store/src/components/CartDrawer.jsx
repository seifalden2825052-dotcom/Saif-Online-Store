import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import {
  useCartStore,
  formatPrice,
  FREE_SHIPPING_THRESHOLD,
  MAX_ITEM_QUANTITY,
  TAX_RATE,
} from "../store/cart";
import { useOverlayA11y } from "../hooks/useOverlayA11y";
import { useRef } from "react";

export default function CartDrawer() {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const openCheckout = useCartStore((state) => state.openCheckout);
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = useCartStore((state) => state.totals)();
  const closeButtonRef = useRef(null);
  const { overlayRef } = useOverlayA11y({
    isOpen: isCartOpen,
    onClose: closeCart,
    initialFocusRef: closeButtonRef,
  });

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-bg/80 backdrop-blur-sm"
          />
          <motion.aside
            ref={overlayRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            tabIndex={-1}
            className="fixed right-0 top-0 z-[70] flex h-[100dvh] w-full max-w-[28rem] flex-col border-l border-line bg-surface/95 text-ink backdrop-blur-xl"
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="cart-drawer-title" className="font-serif text-2xl text-ink">
                Your selection
              </h2>
              <button
                type="button"
                onClick={closeCart}
                ref={closeButtonRef}
                aria-label="Close cart"
                className="rounded-full p-2 text-subtle transition-colors hover:bg-bg-deep hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-surface/50 text-subtle/50 mb-6">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <p className="font-serif text-2xl text-ink">Your bag is empty</p>
                  <p className="mt-3 text-sm font-light text-subtle max-w-[240px]">
                    Pieces added to your selection will be saved here for your convenience.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-8 rounded-full border border-line bg-bg px-8 py-3 text-sm font-medium transition-colors hover:border-neon hover:text-neon"
                  >
                    Continue exploring
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      className="group relative rounded-[1.5rem] border border-line bg-surface/50 p-5 transition-colors hover:border-neon/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3 pr-6">
                          {item.image && (
                            <img
                              src={item.image}
                              alt=""
                              aria-hidden="true"
                              className="h-14 w-14 shrink-0 rounded-xl border border-line object-cover"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-ink">{item.name}</p>
                            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-subtle">
                              {item.variant
                                ? [item.variant.finish, item.variant.size].filter(Boolean).join(" · ")
                                : item.tagline}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="absolute right-4 top-4 rounded-full p-2 text-subtle opacity-0 transition-all hover:bg-bg-deep hover:text-red-500 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="mt-6 flex items-end justify-between">
                        <div className="flex items-center gap-1.5 rounded-full border border-line bg-bg p-1">
                          <button
                            type="button"
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-subtle transition-colors hover:bg-bg-deep hover:text-ink"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase ${item.name} quantity`}
                            disabled={item.quantity >= MAX_ITEM_QUANTITY}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-subtle transition-colors hover:bg-bg-deep hover:text-ink"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-serif text-lg text-ink">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-line bg-surface px-6 py-6">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between font-light text-subtle">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-ink">{formatPrice(totals.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between font-light text-subtle">
                    <dt>Estimated tax ({(TAX_RATE * 100).toFixed(2)}%)</dt>
                    <dd className="font-medium text-ink">{formatPrice(totals.tax)}</dd>
                  </div>
                  <div className="flex justify-between font-light text-subtle">
                    <dt>Shipping estimate (demo)</dt>
                    <dd className="font-medium text-ink">
                      {totals.shipping === 0 ? "Included" : formatPrice(totals.shipping)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-line pt-4 font-serif text-2xl text-ink">
                    <dt>Total</dt>
                    <dd>{formatPrice(totals.total)}</dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-col gap-3">
                  {totals.subtotal > 0 && totals.subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-center text-xs font-medium text-neon">
                      Add {formatPrice(FREE_SHIPPING_THRESHOLD - totals.subtotal)} more for an
                      included demo estimate.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={openCheckout}
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-semibold tracking-wide text-bg transition-all hover:bg-neon hover:text-white"
                  >
                    Continue to demo checkout
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}