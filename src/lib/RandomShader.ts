import { Intensity } from "../flavours";
import enumerate from "../tools/enumerate";
import float2 from "./float2";
import float3 from "./float3";
import { Triangle } from "./Model";
import { MathRNG } from "./Random";
import Shader from "./Shader";

export default class RandomShader implements Shader {
  constructor(
    private colours = enumerate(75).map(() =>
      float3.random<Intensity>(new MathRNG(), 1, 1, 1),
    ),
  ) {}

  getPixelColour(
    texCoord: float2,
    normal: float3,
    depth: number,
    triangle: Triangle,
  ): float3<Intensity> {
    return this.colours[triangle.index % this.colours.length];
  }
}
