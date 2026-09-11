import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroDevice from "../assets/hero-device.jpg";
import MagneticButton from "./MagneticButton";

export default function Hero() {
  return (
    <section id="hero" className="relative w-full border-b border-line bg-bg pt-20 md:pt-0">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center lg:grid lg:h-[clamp(680px,78vh,820px)] lg:grid-cols-2 lg:items-stretch">
        
        <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-neon backdrop-blur-md">
              Edition 01
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-serif text-5xl font-normal leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Considered <br />
            <span className="italic text-subtle">instruments.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-md text-base font-light leading-relaxed text-subtle sm:text-lg"
          >
            Industrial design meant to be felt, not just seen. Engineered with obsidian surfaces, cold-forged metals, and a distinct copper warmth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <MagneticButton
              as="a"
              href="#shop"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-3.5 text-sm font-medium tracking-wide text-bg transition-colors hover:bg-neon hover:text-white"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full overflow-hidden bg-bg-deep lg:h-full lg:rounded-bl-[3rem] lg:border-l lg:border-line"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-bg/40 to-transparent z-10 lg:hidden" />
          <img
            src={heroDevice}
            alt="Auren hardware detail showing copper and obsidian finish"
            className="aspect-[4/3] w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:w-full"
          />
        </motion.div>
        
      </div>
    </section>
  );
}
