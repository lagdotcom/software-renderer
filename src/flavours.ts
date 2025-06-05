// https://spin.atomicobject.com/typescript-flexible-nominal-typing/
interface Flavouring<FlavourT> {
  _type?: FlavourT;
}
type Flavour<T, FlavourT> = T & Flavouring<FlavourT>;

export type Degrees = Flavour<number, "Degrees">;
export type Intensity = Flavour<number, "Intensity">;
export type Milliseconds = Flavour<number, "Milliseconds">;
export type Pixels = Flavour<number, "Pixels">;
export type Radians = Flavour<number, "Radians">;
export type TextureUrl = Flavour<string, "TextureUrl">;
