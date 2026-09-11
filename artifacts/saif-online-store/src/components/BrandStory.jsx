import { motion } from "framer-motion";
import heroDevice from "../assets/hero-device.jpg";

export default function BrandStory() {
  return (
    <section id="story" className="scroll-mt-20 border-b border-line bg-bg py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[16/11] w-full overflow-hidden rounded-[2rem] border border-line bg-surface lg:aspect-[4/3]"
          >
            <img
              src={heroDevice}
              alt="AUREN headphone details in obsidian finish"
              className="h-full w-full scale-125 object-cover object-right grayscale transition-all duration-700 hover:scale-[1.3] hover:grayscale-0"
            />
          </motion.div>

          <div className="flex flex-col justify-center lg:py-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neon"
            >
              The Philosophy
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 font-serif text-4xl font-normal leading-[1.1] tracking-tight text-ink sm:text-5xl"
            >
              Technology should <br />
              serve, not demand.
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 space-y-6 text-base font-light leading-relaxed text-subtle sm:text-lg"
            >
              <p>
                We live in a world of constant notification, bright screens, and disposable plastic. AUREN was born from a desire for restraint. We build for people who appreciate the weight of a machined dial and the silence of exceptional design.
              </p>
              <p>
                Every piece in our collection is crafted to last years, not seasons. Tuned to be quiet, to serve you seamlessly.
              </p>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
