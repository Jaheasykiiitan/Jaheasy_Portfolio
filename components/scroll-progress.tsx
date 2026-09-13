"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
} from "motion/react";

/* Thin reading line that tracks scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });
  const bar = useMotionTemplate`scaleX(${scaleX})`;

  return (
    <motion.div
      aria-hidden="true"
      style={{ transform: bar }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[500] h-px origin-left bg-gradient-to-r from-line via-paper/60 to-line"
    />
  );
}