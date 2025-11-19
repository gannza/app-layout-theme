import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Used by the theme library components
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
