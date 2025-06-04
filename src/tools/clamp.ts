import { max, min } from "../lib/maths";

export function clamp<T extends number>(value: T, minimum: T, maximum: T) {
  return min(max(value, minimum), maximum) as T;
}
