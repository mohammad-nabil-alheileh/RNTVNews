export function visualOrder<T>(items: T[], isRTL: boolean): T[] {
  return isRTL ? [...items].reverse() : items;
}
