import { motion } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

const principles = [
  {
    icon: Truck,
    title: "Responsive by default",
    desc: "The full collection, configurator and bag are designed for touch, mouse and keyboard.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent demo",
    desc: "Checkout is clearly simulated. No card data is requested and no real order is created.",
  },
  {
    icon: RotateCcw,
    title: "Persistent bag",
    desc: "Selections and quantities stay on this device so the complete journey can be evaluated.",
  },
];

export default function Assurances() {
  return (
    <section id="care" className="scroll-mt-20 border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-12">
          {principles.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <item.icon className="h-5 w-5 text-neon mb-4" strokeWidth={1.5} />
              <h3 className="font-serif text-lg text-ink">{item.title}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-subtle">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
