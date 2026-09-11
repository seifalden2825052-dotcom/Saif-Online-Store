import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Headset } from "lucide-react";

const perks = [
  {
    icon: Truck,
    title: "Free 2-day delivery",
    body: "On every order above $500, tracked door to door across the EU and US.",
  },
  {
    icon: RotateCcw,
    title: "30-day returns",
    body: "Prepaid return label in the box. No restocking fee, no phone calls.",
  },
  {
    icon: ShieldCheck,
    title: "3-year warranty",
    body: "Covers battery degradation below 80% and any manufacturing defect.",
  },
  {
    icon: Headset,
    title: "Human support",
    body: "Average first reply in 7 minutes, 07:00–23:00 CET, seven days a week.",
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
