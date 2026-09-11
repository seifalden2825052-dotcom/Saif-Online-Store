import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Headphones,
  Watch,
  Monitor,
  Smartphone,
  Keyboard,
  Plane,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "../store/cart";
import { useUiStore } from "../store/ui";
import { useCartHydration } from "../hooks/useCartHydration";
import { useOverlayA11y } from "../hooks/useOverlayA11y";
import ThemeToggle from "./ThemeToggle";

const megaMenu = [
  { name: "Audio", desc: "Headphones & earbuds", icon: Headphones },
  { name: "Wearables", desc: "Watches & rings", icon: Watch },
  { name: "Displays", desc: "Ultrawide & reference", icon: Monitor },
  { name: "Phones", desc: "Nova series", icon: Smartphone },
  { name: "Desk", desc: "Keyboards & decks", icon: Keyboard },
  { name: "Aerial", desc: "Drones & gimbals", icon: Plane },
];

export default function Navbar() {
  const hydrated = useCartHydration();
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  const openSearch = useUiStore((state) => state.openSearch);
  const count = hydrated ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuCloseRef = useRef(null);
  const { overlayRef: mobileMenuRef } = useOverlayA11y({
    isOpen: mobileMenuOpen,
    onClose: () => setMobileMenuOpen(false),
    initialFocusRef: mobileMenuCloseRef,
  });

  const selectCategory = (category) => {
    window.dispatchEvent(
      new CustomEvent("auren:category", {
        detail: category,
      }),
    );
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-bg/85 border-b border-line shadow-sm backdrop-blur-xl py-0" : "bg-transparent border-transparent py-2"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10">
            <a
              href="#hero"
              className="text-sm font-semibold uppercase tracking-[0.42em] text-ink"
              aria-label="AUREN home"
            >
              AUR<span className="text-neon">EN</span>
            </a>

            <div className="hidden items-center gap-8 md:flex">
              <div
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
                className="relative flex h-16 items-center"
              >
                <button
                  type="button"
                  onFocus={() => setMenuOpen(true)}
                  aria-expanded={menuOpen}
                  className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-ink/70 transition-colors hover:text-ink"
                >
                  Products
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="absolute left-1/2 top-full z-50 w-[36rem] -translate-x-1/3 pt-2"
                    >
                      <div className="grid grid-cols-2 gap-2 rounded-[2rem] border border-line bg-surface/90 p-4 shadow-lift backdrop-blur-2xl">
                        {megaMenu.map((entry) => (
                          <a
                            key={entry.name}
                            href="#shop"
                            onClick={() => selectCategory(entry.name)}
                            className="group flex items-center gap-4 rounded-2xl border border-transparent px-3 py-3 transition-all hover:border-line hover:bg-bg-deep"
                          >
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-bg text-subtle transition-colors group-hover:text-neon group-hover:border-neon/30">
                              <entry.icon className="h-5 w-5" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-ink">
                                {entry.name}
                              </span>
                              <span className="block text-xs font-light text-subtle mt-0.5">{entry.desc}</span>
                            </span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { label: "Story", href: "#story" },
                { label: "Collection", href: "#shop" },
                { label: "Care", href: "#care" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs font-medium uppercase tracking-widest text-ink/70 transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/60 text-subtle backdrop-blur-xl transition-all hover:border-neon/50 hover:text-ink hover:bg-bg-deep"
            >
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/60 text-ink backdrop-blur-xl transition-all hover:border-neon/50 hover:bg-bg-deep"
            >
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-neon px-1.5 text-[10px] font-bold text-white shadow-sm"
                >
                  {count}
                </motion.span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-subtle md:hidden transition-colors hover:bg-bg-deep hover:text-ink"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-bg/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
              tabIndex={-1}
              className="fixed right-0 top-0 z-[70] flex h-[100dvh] w-full max-w-sm flex-col border-l border-line bg-surface/95 text-ink backdrop-blur-xl md:hidden"
            >
              <header className="flex h-16 items-center justify-between border-b border-line px-6">
                <span
                  id="mobile-menu-title"
                  className="text-sm font-semibold uppercase tracking-[0.42em] text-ink"
                >
                  AUR<span className="text-neon">EN</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  ref={mobileMenuCloseRef}
                  aria-label="Close menu"
                  className="rounded-full p-2 text-subtle transition-colors hover:bg-bg-deep hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-8">
                <nav className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-subtle mb-4">
                      Explore
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {[
                        { label: "Story", href: "#story" },
                        { label: "Collection", href: "#shop" },
                        { label: "Care", href: "#care" },
                      ].map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="font-serif text-3xl text-ink transition-colors hover:text-neon"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-subtle mb-4">
                      Collections
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {megaMenu.map((entry) => (
                        <a
                          key={entry.name}
                          href="#shop"
                          onClick={() => selectCategory(entry.name)}
                          className="flex flex-col gap-3 rounded-2xl border border-line bg-bg-deep p-4 transition-colors hover:border-neon/50"
                        >
                          <entry.icon className="h-6 w-6 text-subtle" />
                          <span className="text-sm font-medium text-ink">{entry.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}