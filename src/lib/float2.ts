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

  static random<T extends number>(rng: Random, width: T, height: T) {
    return new float2(rng.upTo(width), rng.upTo(height));
  }

  static dot(a: float2like, b: float2like) {
    return a.x * b.x + a.y * b.y;
  }

  perpendicular() {
    return new float2<T>(this.y, -this.x as T);
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
}
