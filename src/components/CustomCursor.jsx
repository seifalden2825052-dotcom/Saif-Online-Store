import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target;
      const interactive =
        target instanceof Element &&
        !!target.closest("a, button, input, textarea, select, [data-cursor='hover']");
      setActive(interactive);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed left-0 top-0 z-[999] hidden -translate-x-1/2 -translate-y-1/2 md:block"
      >
        <motion.span
          animate={{
            width: active ? 48 : 8,
            height: active ? 48 : 8,
            opacity: active ? 0.55 : 1,
            borderWidth: active ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="block rounded-full border-cyan-300/70 bg-cyan-300 mix-blend-difference"
        />
      </motion.div>
      <style>{`@media (hover: hover) and (pointer: fine){ body, a, button { cursor: none !important; } }`}</style>
    </>
  );
}
