import { motion } from "framer-motion";

const columns = [
  { title: "Products", links: ["Audio", "Wearables", "Displays", "Accessories"] },
  { title: "Company", links: ["About", "Careers", "Press kit", "Sustainability"] },
  { title: "Support", links: ["Track an order", "Returns", "Warranty", "Contact"] },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="border-t border-line bg-surface/30"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <span className="text-lg font-bold tracking-tight text-ink">
            AUR<span className="text-neon">EN</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-slate-400">
            <span className="text-subtle">
              A considered collection of premium technology for sound, sight, movement and focus.
            </span>
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-ink">{column.title}</h3>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#shop"
                    className="text-sm text-subtle transition-colors hover:text-ink"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line px-4 py-6 text-center text-xs text-subtle sm:px-6 lg:px-8">
         © {new Date().getFullYear()} Auren Studio · Precision technology, made more human.
      </div>
    </motion.footer>
  );
}
