import { Intensity, Pixels } from "../flavours";
import float2 from "./float2";
import float3 from "./float3";

export default class RenderTarget {
  colour: Uint8ClampedArray;
  depth: Float32Array;

  constructor(
    public width: Pixels,
    public height: Pixels,
  ) {
    this.colour = new Uint8ClampedArray(width * height * 4);
    this.depth = new Float32Array(width * height);
  }

  get size() {
    return new float2(this.width, this.height);
  }

  get data() {
    return new ImageData(this.colour, this.width, this.height);
  }

  clear() {
    this.colour.fill(0);
    this.depth.fill(Infinity);
  }

  plot(x: Pixels, y: Pixels, { r, g, b }: float3<Intensity>) {
    const i = (y * this.width + x) * 4;
    this.colour[i] = r * 255;
    this.colour[i + 1] = g * 255;
    this.colour[i + 2] = b * 255;
    this.colour[i + 3] = 255;
  }

  depthTest(x: Pixels, y: Pixels, depth: number) {
    const di = y * this.width + x;
    return depth > this.depth[di];
  }

  plotAtDepth(
    x: Pixels,
    y: Pixels,
    depth: number,
    { r, g, b }: float3<Intensity>,
  ) {
    const di = y * this.width + x;
    this.depth[di] = depth;

    const ci = di * 4;
    this.colour[ci] = r * 255;
    this.colour[ci + 1] = g * 255;
    this.colour[ci + 2] = b * 255;
    this.colour[ci + 3] = 255;
  }
}
