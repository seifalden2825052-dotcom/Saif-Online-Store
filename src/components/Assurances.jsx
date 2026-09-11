import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Headset } from "lucide-react";

const perks = [
  {
    icon: Truck,
    title: "Delivery, considered",
    body: "Complimentary tracked delivery on orders above $500, with updates at every step.",
  },
  {
    icon: RotateCcw,
    title: "30-day perspective",
    body: "Try it in your space. Return it with a prepaid label if it is not the right fit.",
  },
  {
    icon: ShieldCheck,
    title: "Auren care",
    body: "Three years of cover for manufacturing defects and battery performance below 80%.",
  },
  {
    icon: Headset,
    title: "Real people",
    body: "Product advice from a human team, seven days a week, without a maze of forms.",
  },
];

export default function Assurances() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {perks.map((perk, index) => (
          <motion.div
            key={perk.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
          >
            <perk.icon className="h-6 w-6 text-blue-500" />
            <h3 className="mt-4 font-semibold text-slate-50">{perk.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{perk.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
