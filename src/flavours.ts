// https://spin.atomicobject.com/typescript-flexible-nominal-typing/
interface Flavouring<FlavourT> {
  _type?: FlavourT;
}
type Flavour<T, FlavourT> = T & Flavouring<FlavourT>;

export type Intensity = Flavour<number, "Intensity">;
export type Pixels = Flavour<number, "Pixels">;
export type Radians = Flavour<number, "Radians">;
export type WavefrontObjData = Flavour<string, "WavefrontObjData">;
