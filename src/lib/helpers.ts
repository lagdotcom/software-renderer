import { Intensity, Pixels } from "../flavours";
import float2 from "./float2";
import float3 from "./float3";
import { pointInTriangle } from "./maths";

export function createImage(
  width: Pixels,
  height: Pixels,
  shader: (x: Pixels, y: Pixels) => float3<Intensity>,
) {
  const image: float3<Intensity>[][] = [];

  for (let y = 0; y < height; y++) {
    const row: float3<Intensity>[] = [];
    image.push(row);

    for (let x = 0; x < width; x++) row.push(shader(x, y));
  }

  return image;
}

export function createTestImage01(width: Pixels, height: Pixels) {
  return createImage(width, height, (x, y) => {
    {
      const r = x / (width - 1);
      const g = y / (height - 1);
      return new float3(r, g, 0);
    }
  });
}

export function createTestImage02(
  width: Pixels,
  height: Pixels,
  unscaled: [float2, float2, float2],
) {
  const [a, b, c] = unscaled.map((p) => p.mul(width, height));
  return createImage(width, height, (x, y) => {
    const p = new float2(x, y);
    const inside = pointInTriangle(a, b, c, p);
    return inside ? new float3(0, 0, 1) : new float3(0, 0, 0);
  });
}
