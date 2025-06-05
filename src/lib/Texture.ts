import { Intensity, Pixels } from "../flavours";
import float2 from "./float2";
import float3 from "./float3";
import { round } from "./maths";

export default class Texture {
  width: Pixels;
  height: Pixels;
  colours: float3<Intensity>[];

  constructor({ width, height, data }: ImageData) {
    this.width = width;
    this.height = height;
    this.colours = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      this.colours.push(new float3<Intensity>(r / 255, g / 255, b / 255));
    }
  }

  sample(texCoord: float2): float3<Intensity> {
    const { width, height, colours } = this;
    texCoord = texCoord.saturate();

    const x = round(texCoord.x * (width - 1));
    const y = round((1 - texCoord.y) * (height - 1));

    const i = y * width + x;
    return colours[i];
  }
}
