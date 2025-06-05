import float2 from "./float2";
import float3 from "./float3";
import Shader from "./Shader";

export default class LitShader implements Shader {
  constructor(public directionToLight: float3) {}

  getPixelColour(texCoord: float2, normal: float3) {
    const intensity =
      (float3.dot(normal.normalize(), this.directionToLight) + 1) / 2;
    return new float3(intensity, intensity, intensity);
  }
}
