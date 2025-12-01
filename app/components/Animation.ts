import { Variants } from "framer-motion";

export const headingVariants = {
  hidden: () => ({ opacity: 0, y: 20 }),
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeInOut" },
  }),
} as const satisfies Record<
  string,
  (delay?: number) => Variants[keyof Variants]
>;
export const subtextVariants = {
  hidden: () => ({ opacity: 0, y: 20 }),
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: "easeInOut" },
  }),
} as const satisfies Record<
  string,
  (delay?: number) => Variants[keyof Variants]
>;
export const buttonVariants = {
  hidden: () => ({ opacity: 0, y: 20 }),
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, delay, ease: "easeInOut" },
  }),
} as const satisfies Record<
  string,
  (delay?: number) => Variants[keyof Variants]
>;

export const listVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: custom * 0.2, // each item delayed a bit more
      ease: "easeInOut",
    },
  }),
};
