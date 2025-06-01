import { Intensity, Pixels } from "../flavours";
import float2 from "./float2";
import float3 from "./float3";

export default class RenderTarget {
  buffer: Uint8ClampedArray;

  constructor(
    public width: Pixels,
    public height: Pixels,
  ) {
    this.buffer = new Uint8ClampedArray(width * height * 4);
  }

  get size() {
    return new float2(this.width, this.height);
  }

  get data() {
    return new ImageData(this.buffer, this.width, this.height);
  }

  clear() {
    this.buffer.fill(0);
  }

  plot(x: Pixels, y: Pixels, { r, g, b }: float3<Intensity>) {
    const i = (y * this.width + x) * 4;
    this.buffer[i] = r * 255;
    this.buffer[i + 1] = g * 255;
    this.buffer[i + 2] = b * 255;
    this.buffer[i + 3] = 255;
  }
}
