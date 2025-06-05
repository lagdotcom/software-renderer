import { Intensity } from "../flavours";
import float2 from "./float2";
import float3 from "./float3";
import { Triangle } from "./Model";
import Shader from "./Shader";
import Texture from "./Texture";

export type MaterialTextures = Record<string, Texture>;

export default class MaterialShader implements Shader {
  constructor(public materials: MaterialTextures) {}

  getPixelColour(texCoord: float2, normal: float3, triangle: Triangle) {
    const texture = this.materials[triangle.material ?? ""];
    return texture?.sample(texCoord) ?? new float3<Intensity>(255, 0, 255);
  }
}
