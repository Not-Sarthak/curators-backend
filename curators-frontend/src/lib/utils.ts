import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to merge class names intelligently.
 * It ensures Tailwind classes are merged correctly without duplication.
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}
