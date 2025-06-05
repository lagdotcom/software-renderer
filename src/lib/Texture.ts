import { Intensity } from "../flavours";
import float2 from "./float2";
import float3 from "./float3";
import { round } from "./maths";

export default class Texture {
  constructor(private data: ImageData) {}

  sample(texCoord: float2): float3<Intensity> {
    const { width, height, data } = this.data;
    texCoord = texCoord.saturate();

    const x = round(texCoord.x * (width - 1));
    const y = round(texCoord.y * (height - 1));

    const i = (y * height + x) * 4;
    return new float3(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
  }
}
