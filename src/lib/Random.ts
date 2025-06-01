import { Intensity } from "../flavours";

export default interface Random {
  next(): Intensity;
  upTo<T extends number>(max: T): T;
}

export class MathRNG implements Random {
  next() {
    return Math.random();
  }

  upTo<T extends number>(max: T) {
    return (this.next() * max) as T;
  }
}
