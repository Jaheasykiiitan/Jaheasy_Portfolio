"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType, ReactNode } from "react";

const CINE_EASE = [0.22, 1, 0.36, 1] as const;

/* Generic fade + rise scroll reveal. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-15% 0px -15% 0px" }}
      transition={{ duration: 0.9, delay, ease: CINE_EASE }}
    >
      {children}
    </motion.div>
  );
}

/* One line revealed by sliding up out of a clipped mask. */
export function MaskLine({
  children,
  className,
  delay = 0,
  as = "span",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const Tag = (reduce ? "span" : motion[as as "span"]) as ElementType;

  if (reduce) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <Tag
        className="block"
        initial={{ y: "115%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 1.05, delay, ease: CINE_EASE }}
      >
        {children}
      </Tag>
    </span>
  );
}