import { motion } from "framer-motion";

const navigation = [
  { 
    label: "Auren Studio", 
    items: ["Our Story", "Materials", "Environmental", "Journal"] 
  },
  { 
    label: "Client Care", 
    items: ["Track Order", "Returns", "Warranty", "Contact"] 
  },
];

export default function Footer() {
  return (
    <motion.footer
      id="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
      className="border-t border-line bg-bg pt-20 pb-10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-sm">
            <span className="font-serif text-2xl tracking-wide text-ink">
              AUREN
            </span>
            <p className="mt-4 text-sm font-light leading-relaxed text-subtle">
              Engineered objects for those who value silent precision and enduring materials.
            </p>
          </div>

          {navigation.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink">
                {group.label}
              </h3>
              <ul className="mt-6 space-y-4">
                {group.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm font-light text-subtle transition-colors hover:text-neon">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-xs font-light text-subtle">
            © {new Date().getFullYear()} Auren Studio. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs font-light text-subtle">
            <a href="#" className="transition-colors hover:text-ink">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-ink">Terms of Service</a>
          </div>
        </div>
        
      </div>
    </motion.footer>
  );
}
