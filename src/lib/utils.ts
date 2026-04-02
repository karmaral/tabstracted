export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(number: number, min: number, max: number): number {
  return Math.max(min, Math.min(number, max));
}