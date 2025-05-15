
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to safely parse string values from filters to numbers
 */
export function parseNumberFilter(value: string | number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Helper function to safely parse boolean values from filters
 */
export function parseBooleanFilter(value: string | boolean | undefined): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowercased = value.toLowerCase();
    if (lowercased === 'true' || lowercased === 'yes' || lowercased === 'si' || lowercased === 'sí') return true;
    if (lowercased === 'false' || lowercased === 'no') return false;
  }
  return undefined;
}

/**
 * Helper function to safely extract number from a string (e.g. "400 mm" -> 400)
 */
export function extractNumberFromString(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/(\d+(\.\d+)?)/);
  if (match) {
    return parseFloat(match[1]);
  }
  return undefined;
}

