import { Degrees, Radians } from "../flavours";
import { clamp } from "../tools/clamp";
import float2 from "./float2";
import float3 from "./float3";

export const { abs, ceil, cos, floor, max, min, PI, round, sin, sqrt, tan } =
  Math;

export function pointOnRightSideOfLine(a: float2, b: float2, p: float2) {
  const ap = p.sub(a);
  const abPerp = b.sub(a).perpendicular();
  return float2.dot(ap, abPerp) >= 0;
}

export function signedTriangleArea(a: float2, b: float2, c: float2) {
  const ac = c.sub(a);
  const abPerp = b.sub(a).perpendicular();
  return float2.dot(ac, abPerp) / 2;
}

export function pointInTriangle(a: float2, b: float2, c: float2, p: float2) {
  const areaABP = signedTriangleArea(a, b, p);
  const areaBCP = signedTriangleArea(b, c, p);
  const areaCAP = signedTriangleArea(c, a, p);
  const inTri = areaABP >= 0 && areaBCP >= 0 && areaCAP >= 0;

  const totalArea = areaABP + areaBCP + areaCAP;
  const invAreaSum = 1 / totalArea;
  const weightA = areaBCP * invAreaSum;
  const weightB = areaCAP * invAreaSum;
  const weightC = areaABP * invAreaSum;
  const weights = new float3(weightA, weightB, weightC);

  return [inTri && totalArea > 0, weights] as const;
}

export const TWO_PI = Math.PI * 2;

export function toRadians(a: Degrees): Radians {
  return (a / 360) * TWO_PI;
}

export function toDegrees(a: Radians): Degrees {
  return (a / TWO_PI) * 360;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp(t, 0, 1);
}
