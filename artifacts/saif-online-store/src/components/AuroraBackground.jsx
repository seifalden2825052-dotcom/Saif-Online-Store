import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [-80, 120, -80], y: [-60, 40, -60], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 -top-40 h-[36rem] w-[36rem] rounded-full bg-neon/20 blur-[130px]"
      />
      <motion.div
        animate={{ x: [80, -120, 80], y: [40, -60, 40], scale: [1.1, 0.95, 1.1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-28 top-10 h-[32rem] w-[32rem] rounded-full bg-neon/12 blur-[140px]"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-neon/10 blur-[150px]"
      />
      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
    </div>
  );
}
