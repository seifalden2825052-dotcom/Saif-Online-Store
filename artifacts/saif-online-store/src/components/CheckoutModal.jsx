import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { useCartStore, formatPrice, TAX_RATE } from "../store/cart";
import { useOverlayA11y } from "../hooks/useOverlayA11y";

const emptyForm = {
  email: "",
  name: "",
  address: "",
  city: "",
  zip: "",
};

export default function CheckoutModal() {
  const isCheckoutOpen = useCartStore((state) => state.isCheckoutOpen);
  const closeCheckout = useCartStore((state) => state.closeCheckout);
  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore((state) => state.items);
  const totals = useCartStore((state) => state.totals)();

  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState("demo");
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const closeButtonRef = useRef(null);
  const processingTimerRef = useRef(null);
  const { overlayRef } = useOverlayA11y({
    isOpen: isCheckoutOpen,
    onClose: closeCheckout,
    initialFocusRef: closeButtonRef,
  });

  useEffect(() => {
    if (!isCheckoutOpen) {
      setStatus("idle");
      setForm(emptyForm);
      setPaymentMethod("demo");
      setErrors({});
    }
  }, [isCheckoutOpen]);

  useEffect(
    () => () => {
      if (processingTimerRef.current) window.clearTimeout(processingTimerRef.current);
    },
    [],
  );

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(form.email)) {
      next.email = "Enter a valid email";
    }
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (form.address.trim().length < 4) next.address = "Enter a street address";
    if (form.city.trim().length < 2) next.city = "Enter a city";
    if (!/^\d{4,10}$/.test(form.zip.trim())) next.zip = "Enter a postal code";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (status === "processing" || items.length === 0 || !validate()) return;

    setStatus("processing");
    processingTimerRef.current = window.setTimeout(() => {
      setStatus("done");
      clearCart();
      processingTimerRef.current = null;
    }, 1000);
  };

  const dismiss = () => {
    if (processingTimerRef.current) {
      window.clearTimeout(processingTimerRef.current);
      processingTimerRef.current = null;
    }
    closeCheckout();
  };

  const field = (name, label, props = {}) => (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-subtle">{label}</span>
      <input
        {...props}
        value={form[name]}
        onChange={update(name)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className={`mt-2 w-full rounded-xl border bg-surface/50 px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-subtle focus:bg-surface ${
          errors[name]
            ? "border-destructive focus:border-destructive"
            : "border-line focus:border-neon"
        }`}
      />
      {errors[name] && (
        <span id={`${name}-error`} className="mt-1.5 block text-xs text-destructive">
          {errors[name]}
        </span>
      )}
    </label>
  );

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 bg-bg/90 backdrop-blur-xl"
          />
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-dialog-title"
            tabIndex={-1}
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-line bg-surface/90 shadow-lift backdrop-blur-2xl"
          >
            <header className="flex items-center justify-between border-b border-line px-8 py-6">
              <div className="flex items-center gap-3 text-ink">
                <Sparkles className="h-4 w-4 text-neon" />
                <h2 id="checkout-dialog-title" className="font-serif text-xl">
                  Demo checkout
                </h2>
                <span className="rounded-full border border-neon/40 bg-neon/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-neon">
                  Demo · no charge
                </span>
              </div>
              <button
                type="button"
                onClick={dismiss}
                ref={closeButtonRef}
                aria-label="Close checkout"
                className="rounded-full p-2 text-subtle transition-colors hover:bg-bg-deep hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {status === "done" ? (
              <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-surface/50 text-neon">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-8 font-serif text-4xl text-ink">Demo confirmation</h3>
                <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-subtle">
                  Thanks, <span className="font-medium text-ink">{form.name}</span>. No order was
                  placed and no payment was processed. Nothing will ship from this demonstration.
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-widest text-neon">
                  Your bag has been cleared for this demo
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  className="mt-10 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-colors hover:bg-neon hover:text-white"
                >
                  Return to collection
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1.2fr_1fr]">
                <form onSubmit={submit} className="space-y-8 p-8 sm:p-10" noValidate>
                  <div>
                    <h3 className="mb-6 font-serif text-xl text-ink">Contact & address</h3>
                    <div className="space-y-4">
                      {field("email", "Email address", {
                        type: "email",
                        placeholder: "you@example.com",
                        autoComplete: "email",
                      })}
                      {field("name", "Full name", {
                        placeholder: "Alex Moreau",
                        autoComplete: "name",
                      })}
                      {field("address", "Street address", {
                        placeholder: "Keizersgracht 118",
                        autoComplete: "street-address",
                      })}
                      <div className="grid grid-cols-2 gap-4">
                        {field("city", "City", { placeholder: "Amsterdam", autoComplete: "address-level2" })}
                        {field("zip", "Postal code", {
                          placeholder: "1015",
                          autoComplete: "postal-code",
                          inputMode: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <fieldset className="border-t border-line pt-8">
                    <legend className="mb-6 font-serif text-xl text-ink">Payment (demo)</legend>
                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neon/50 bg-neon/5 p-4">
                      <input
                        type="radio"
                        name="payment-method"
                        value="demo"
                        checked={paymentMethod === "demo"}
                        onChange={(event) => setPaymentMethod(event.target.value)}
                        className="mt-1 accent-neon"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-ink">
                          Simulated payment
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-subtle">
                          This option only shows the confirmation flow. No payment details are
                          requested and no charge can be made.
                        </span>
                      </span>
                    </label>
                  </fieldset>

                  <button
                    type="submit"
                    disabled={status === "processing" || items.length === 0 || paymentMethod !== "demo"}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-semibold tracking-wide text-bg transition-colors hover:bg-neon hover:text-white disabled:cursor-not-allowed disabled:bg-line disabled:text-subtle"
                  >
                    {status === "processing" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Preparing demo confirmation
                      </>
                    ) : (
                      <>Simulate demo confirmation — {formatPrice(totals.total)}</>
                    )}
                  </button>
                  <p className="text-center text-[11px] font-bold uppercase tracking-widest text-neon">
                    Demo only · no order · no charge
                  </p>
                </form>

                <aside className="border-t border-line bg-surface/30 p-8 sm:p-10 lg:border-l lg:border-t-0">
                  <h3 className="font-serif text-xl text-ink">Demo summary</h3>
                  <ul className="mt-8 space-y-5">
                    {items.map((item) => (
                      <li key={item.id} className="flex justify-between gap-4 text-sm">
                        <div className="flex min-w-0 items-start gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt=""
                              aria-hidden="true"
                              className="h-12 w-12 shrink-0 rounded-lg border border-line object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-ink">{item.name}</p>
                            {item.variant && (
                              <p className="mt-1 text-xs text-subtle">
                                {[item.variant.finish, item.variant.size].filter(Boolean).join(" · ")}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-subtle">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="whitespace-nowrap font-medium text-ink">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-10 space-y-3 border-t border-line pt-6 text-sm">
                    <div className="flex justify-between font-light text-subtle">
                      <dt>Subtotal</dt>
                      <dd className="font-medium text-ink">{formatPrice(totals.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between font-light text-subtle">
                      <dt>Tax estimate</dt>
                      <dd className="font-medium text-ink">{formatPrice(totals.tax)}</dd>
                    </div>
                    <div className="flex justify-between font-light text-subtle">
                      <dt>Shipping estimate</dt>
                      <dd className="font-medium text-ink">
                        {totals.shipping === 0 ? "Complimentary" : formatPrice(totals.shipping)}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-line pt-6 font-serif text-2xl text-ink">
                      <dt>Total estimate</dt>
                      <dd>{formatPrice(totals.total)}</dd>
                    </div>
                  </dl>
                  <p className="mt-8 text-xs leading-relaxed text-subtle">
                    This summary is for demonstration only. It does not create an order or schedule
                    fulfillment.
                  </p>
                </aside>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}