import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge
 * This allows for conditional classes and ensures that Tailwind conflicts are resolved correctly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
