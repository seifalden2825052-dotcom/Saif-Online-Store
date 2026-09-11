import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
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

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-line bg-bg/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <a
            href="#shop"
            className="text-sm font-semibold uppercase tracking-[0.42em] text-ink"
            aria-label="NEXUS home"
          >
            Nex<span className="text-neon">us</span>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            <div
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
              className="relative"
            >
              <button
                type="button"
                onFocus={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                className="flex items-center gap-1 text-sm font-medium text-ink/80 transition-colors hover:text-ink"
              >
                Products
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/3 pt-4"
                  >
                    <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-line bg-surface/85 p-3 shadow-lift backdrop-blur-2xl">
                      {megaMenu.map((entry) => (
                        <a
                          key={entry.name}
                          href="#shop"
                          className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-all hover:border-line hover:bg-bg-deep"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-bg text-neon transition-transform group-hover:scale-105">
                            <entry.icon className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-ink">
                              {entry.name}
                            </span>
                            <span className="block text-xs text-subtle">{entry.desc}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {["Design", "Support", "Stores"].map((link) => (
              <a
                key={link}
                href="#shop"
                className="text-sm font-medium text-subtle transition-colors hover:text-ink"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search products"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/60 text-subtle backdrop-blur-xl transition-colors hover:border-neon/50 hover:text-ink"
          >
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/60 text-ink backdrop-blur-xl transition-colors hover:border-neon/50"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-neon px-1 text-xs font-semibold text-white"
              >
                {count}
              </motion.span>
            )}
          </button>
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-subtle md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
