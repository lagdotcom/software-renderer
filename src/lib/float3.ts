import float2 from "./float2";
import { sqrt } from "./maths";
import Random from "./Random";

export interface float3like<T extends number = number> {
  x: T;
  y: T;
  z: T;
}

export default class float3<T extends number = number> {
  constructor(
    public x: T,
    public y: T,
    public z: T,
  ) {}

  static zero = new float3<number>(0, 0, 0);

  static random<T extends number>(rng: Random, x: T, y: T, z: T) {
    return new float3(rng.upTo(x), rng.upTo(y), rng.upTo(z));
  }

  static dot(a: float3like, b: float3like) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  toString() {
    return `{${this.x.toFixed(2)} ${this.y.toFixed(2)} ${this.z.toFixed(2)}}`;
  }

  get r() {
    return this.x;
  }
  set r(value: T) {
    this.x = value;
  }

  get g() {
    return this.y;
  }
  set g(value: T) {
    this.y = value;
  }

  get b() {
    return this.z;
  }
  set b(value: T) {
    this.z = value;
  }

  get xy() {
    return new float2(this.x, this.y);
  }

  get magnitude() {
    return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const { magnitude, x, y, z } = this;
    if (!magnitude) return new float3(0, 0, 0);

    return new float3(x / magnitude, y / magnitude, z / magnitude);
  }

  add(o: float3like) {
    return new float3(this.x + o.x, this.y + o.y, this.z + o.z);
  }

  sub(o: float3like) {
    return new float3(this.x - o.x, this.y - o.y, this.z - o.z);
  }

  mul(x: number, y = x, z = y) {
    return new float3(this.x * x, this.y * y, this.z * z);
  }
}
