import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import heroDevice from "../assets/hero-device.jpg";
import AuroraBackground from "./AuroraBackground";
import MagneticButton from "./MagneticButton";

const stats = [
  { label: "Independent pieces", value: "08" },
  { label: "Average rating", value: "4.8/5" },
  { label: "Warranty included", value: "03 yrs" },
];

const words = "Precision for the everyday".split(" ");

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden border-b border-white/5">
      <AuroraBackground />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-32">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-slate-300 backdrop-blur-xl"
          >
            AUREN / EDITION 01 · NOW SHIPPING
          </motion.span>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-6xl lg:text-7xl">
            {words.map((word, index) => (
              <motion.span
                key={word + index}
                initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="mr-3 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-slate-400"
          >
            A considered collection of devices built around one idea: technology should feel
            quieter, smarter, and better made. Selected for people who notice the details.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              as="a"
              href="#shop"
              className="group inline-flex items-center gap-2 rounded-full bg-slate-50 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
            >
              Explore the collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#shop"
              strength={0.2}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-xl transition-colors hover:border-white/25"
            >
              Read the Auren standard
            </MagneticButton>
          </motion.div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/5 pt-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.08 }}
              >
                <dt className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  {stat.label}
                </dt>
                <dd className="mt-1.5 text-2xl font-semibold text-slate-50">{stat.value}</dd>
              </motion.div>
            ))}
          </dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
            <img
              src={heroDevice}
              alt="Quantum ANC Headphones lit by cyan studio light"
              width={1600}
              height={1200}
              className="h-full w-full rounded-[1.6rem] object-cover"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute -bottom-7 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4 backdrop-blur-2xl sm:left-8 sm:right-8"
          >
              <span className="flex items-center gap-2 text-sm text-slate-300">
                <Truck className="h-4 w-4 text-cyan-300" /> Complimentary delivery over $500
            </span>
            <span className="flex items-center gap-2 text-sm text-slate-300">
                <ShieldCheck className="h-4 w-4 text-cyan-300" /> Auren care, included
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
