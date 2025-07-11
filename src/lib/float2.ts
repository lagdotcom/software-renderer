import { clamp } from "../tools/clamp";
import { abs, lerp } from "./maths";
import Random from "./Random";

export interface float2like<T extends number = number> {
  x: T;
  y: T;
}

export default class float2<T extends number = number> {
  constructor(
    public x: T,
    public y: T,
  ) {}

  static zero = new float2<number>(0, 0);

  static random<T extends number>(rng: Random, width: T, height: T) {
    return new float2(rng.upTo(width), rng.upTo(height));
  }

  static dot(a: float2like, b: float2like) {
    return a.x * b.x + a.y * b.y;
  }

  static lerp(a: float2like, b: float2like, t: number) {
    return new float2(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
  }

  perpendicular() {
    return new float2<T>(this.y, -this.x as T);
  }

  saturate() {
    return new float2(clamp<number>(this.x, 0, 1), clamp<number>(this.y, 0, 1));
  }

  add(other: float2like) {
    return new float2(this.x + other.x, this.y + other.y);
  }

  sub(other: float2like) {
    return new float2(this.x - other.x, this.y - other.y);
  }

  mul(x: number, y = x) {
    return new float2(this.x * x, this.y * y);
  }

  div(x: number, y = x) {
    return new float2(this.x / x, this.y / y);
  }

  abs() {
    return new float2(abs(this.x), abs(this.y));
  }
}
