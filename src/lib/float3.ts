import Random from "./Random";

export default class float3<T extends number = number> {
  constructor(
    public x: T,
    public y: T,
    public z: T,
  ) {}

  static random<T extends number>(rng: Random, x: T, y: T, z: T) {
    return new float3(rng.upTo(x), rng.upTo(y), rng.upTo(z));
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
}
