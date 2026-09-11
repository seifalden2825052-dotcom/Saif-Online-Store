import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore, formatPrice, FREE_SHIPPING_THRESHOLD, TAX_RATE } from "../store/cart";

export default function CartDrawer() {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const openCheckout = useCartStore((state) => state.openCheckout);
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = useCartStore((state) => state.totals)();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-bg/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-line bg-surface/95 text-ink backdrop-blur-md"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-semibold text-ink">Your bag</h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-lg p-2 text-subtle transition-colors hover:bg-bg-deep hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-10 w-10 text-subtle/50" />
                  <p className="mt-4 font-medium text-ink">Nothing in your bag yet</p>
                  <p className="mt-1 text-sm text-subtle">
                    Add a product and it will stay saved on this device.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="rounded-xl border border-line bg-bg-deep/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink">{item.name}</p>
                          <p className="mt-0.5 text-xs text-subtle">{item.tagline}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="rounded-md p-1.5 text-subtle transition-colors hover:bg-bg-deep hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-lg border border-line">
                          <button
                            type="button"
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="p-2 text-subtle transition-colors hover:text-ink"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase ${item.name} quantity`}
                            className="p-2 text-subtle transition-colors hover:text-ink"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-semibold text-ink">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-line px-5 py-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-subtle">
                  <dt>Subtotal</dt>
                  <dd className="text-ink">{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-subtle">
                  <dt>Estimated tax ({(TAX_RATE * 100).toFixed(2)}%)</dt>
                  <dd className="text-ink">{formatPrice(totals.tax)}</dd>
                </div>
                <div className="flex justify-between text-subtle">
                  <dt>Shipping</dt>
                  <dd className="text-ink">
                    {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base font-semibold text-ink">
                  <dt>Total</dt>
                  <dd>{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              {totals.subtotal > 0 && totals.subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="mt-3 text-xs text-neon">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - totals.subtotal)} more for free
                  delivery.
                </p>
              )}

              <button
                type="button"
                disabled={items.length === 0}
                onClick={openCheckout}
                className="mt-4 w-full rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-bg transition-colors hover:bg-neon hover:text-white disabled:cursor-not-allowed disabled:bg-line disabled:text-subtle"
              >
                Checkout
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
