import { Intensity } from "../flavours";
import float2 from "./float2";
import float3 from "./float3";
import Shader from "./Shader";
import Texture from "./Texture";

export default class LitTextureShader implements Shader {
  constructor(
    public texture: Texture,
    public directionToLight: float3,
  ) {}

  getPixelColour(texCoord: float2, normal: float3): float3<Intensity> {
    const colour = this.texture.sample(texCoord);
    const intensity =
      (float3.dot(normal.normalize(), this.directionToLight) + 1) / 2;

    return colour.mul(intensity, intensity, intensity);
  }
}
