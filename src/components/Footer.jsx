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
      className="border-t border-slate-800 bg-slate-900/30"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-50">
            AUR<span className="text-blue-500">EN</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-slate-400">
            A considered collection of premium technology for sound, sight, movement and focus.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-slate-50">{column.title}</h3>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#shop"
                    className="text-sm text-slate-400 transition-colors hover:text-slate-50"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800 px-4 py-6 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
         © {new Date().getFullYear()} Auren Studio · Precision technology, made more human.
      </div>
    </motion.footer>
  );
}
