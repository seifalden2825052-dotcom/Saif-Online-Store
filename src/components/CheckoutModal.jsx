import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Lock, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { useCartStore, formatPrice, TAX_RATE } from "../store/cart";

const emptyForm = {
  email: "",
  name: "",
  address: "",
  city: "",
  zip: "",
  card: "",
  expiry: "",
  cvc: "",
};

export default function CheckoutModal() {
  const isCheckoutOpen = useCartStore((state) => state.isCheckoutOpen);
  const closeCheckout = useCartStore((state) => state.closeCheckout);
  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore((state) => state.items);
  const totals = useCartStore((state) => state.totals)();

  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(form.email)) next.email = "Enter a valid email";
    if (form.name.trim().length < 2) next.name = "Enter the name on the card";
    if (form.address.trim().length < 4) next.address = "Enter a street address";
    if (form.city.trim().length < 2) next.city = "Enter a city";
    if (!/^\d{4,10}$/.test(form.zip.trim())) next.zip = "Enter a postal code";
    if (form.card.replace(/\s/g, "").length < 15) next.card = "Enter a 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry.trim())) next.expiry = "MM/YY";
    if (!/^\d{3,4}$/.test(form.cvc.trim())) next.cvc = "3 digits";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (status === "processing" || !validate()) return;
    setStatus("processing");
    setTimeout(() => {
      setStatus("done");
      clearCart();
    }, 1600);
  };

  const dismiss = () => {
    closeCheckout();
    setTimeout(() => {
      setStatus("idle");
      setForm(emptyForm);
      setErrors({});
    }, 250);
  };

  const field = (name, label, props = {}) => (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      <input
        {...props}
        value={form[name]}
        onChange={update(name)}
        className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-50 outline-none transition-colors placeholder:text-slate-600 focus:border-blue-500"
      />
      {errors[name] && <span className="mt-1 block text-xs text-red-400">{errors[name]}</span>}
    </label>
  );

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Checkout"
            className="relative z-10 my-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md"
          >
            <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-500" />
                <h2 className="text-base font-semibold text-slate-50">
                  Secure checkout · AUREN
                </h2>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close checkout"
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {status === "done" ? (
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <CheckCircle2 className="h-12 w-12 text-blue-500" />
                <h3 className="mt-4 text-xl font-semibold text-slate-50">Order confirmed</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  We emailed a receipt to {form.email || "your inbox"}. Your order leaves the
                  AUREN fulfillment within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  Keep browsing
                </button>
              </div>
            ) : (
              <div className="grid gap-8 px-6 py-6 md:grid-cols-[1.3fr_1fr]">
                <form onSubmit={submit} className="space-y-4" noValidate>
                  <h3 className="text-sm font-semibold text-slate-200">Contact & delivery</h3>
                  {field("email", "Email", {
                    type: "email",
                    placeholder: "you@company.com",
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
                  <div className="grid grid-cols-2 gap-3">
                    {field("city", "City", { placeholder: "Amsterdam" })}
                    {field("zip", "Postal code", { placeholder: "1015" })}
                  </div>

                  <h3 className="pt-2 text-sm font-semibold text-slate-200">Payment</h3>
                  {field("card", "Card number", {
                    placeholder: "4242 4242 4242 4242",
                    inputMode: "numeric",
                  })}
                  <div className="grid grid-cols-2 gap-3">
                    {field("expiry", "Expiry", { placeholder: "04/29" })}
                    {field("cvc", "CVC", { placeholder: "123", inputMode: "numeric" })}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "processing" || items.length === 0}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                  >
                    {status === "processing" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing payment
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" /> Pay {formatPrice(totals.total)}
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    Demo checkout — no card is charged and no data leaves this device.
                  </p>
                </form>

                <aside className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                  <h3 className="text-sm font-semibold text-slate-200">Order summary</h3>
                  <ul className="mt-4 space-y-3">
                    {items.map((item) => (
                      <li key={item.id} className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-300">
                          {item.name}
                          <span className="text-slate-500"> × {item.quantity}</span>
                        </span>
                        <span className="whitespace-nowrap text-slate-100">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-5 space-y-2 border-t border-slate-800 pt-4 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <dt>Subtotal</dt>
                      <dd className="text-slate-200">{formatPrice(totals.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <dt>Tax ({(TAX_RATE * 100).toFixed(2)}%)</dt>
                      <dd className="text-slate-200">{formatPrice(totals.tax)}</dd>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <dt>Shipping</dt>
                      <dd className="text-slate-200">
                        {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-3 text-base font-semibold text-slate-50">
                      <dt>Total</dt>
                      <dd>{formatPrice(totals.total)}</dd>
                    </div>
                  </dl>
                </aside>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
