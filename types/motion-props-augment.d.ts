import type { VariantLabels } from "framer-motion";

declare module "framer-motion" {
  interface MotionProps {
    initial?: boolean | VariantLabels | unknown;
    animate?: VariantLabels | unknown;
    exit?: VariantLabels | unknown;
    whileHover?: VariantLabels | unknown;
    whileTap?: VariantLabels | unknown;
    whileFocus?: VariantLabels | unknown;
    whileDrag?: VariantLabels | unknown;
    whileInView?: VariantLabels | unknown;
    variants?: unknown;
    transition?: unknown;
    custom?: unknown;
    layout?: boolean | "position" | "size" | "preserve-aspect";
    layoutId?: string;
    layoutDependency?: unknown;
    viewport?: unknown;
    onAnimationStart?: unknown;
    onAnimationComplete?: unknown;
    onUpdate?: unknown;
  }
}