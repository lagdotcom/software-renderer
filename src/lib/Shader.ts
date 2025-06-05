import { Intensity } from "../flavours";
import float2 from "./float2";
import float3 from "./float3";
import { Triangle } from "./Model";

export default interface Shader {
  getPixelColour(
    texCoord: float2,
    normal: float3,
    triangle: Triangle,
  ): float3<Intensity>;
}
