import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function sanitizeClient(obj: Record<string, any>) {
  const copy = { ...obj };
  Object.keys(copy).forEach((k) => {
    if (copy[k] === "" || copy[k] == null) delete copy[k];
  });
  return copy;
}