import float2 from "./float2";

export function dot(a: float2, b: float2) {
  return a.x * b.x + a.y * b.y;
}

export function pointOnRightSideOfLine(a: float2, b: float2, p: float2) {
  const ap = p.sub(a);
  const abPerp = b.sub(a).perpendicular();
  return dot(ap, abPerp) >= 0;
}

export function pointInTriangle(a: float2, b: float2, c: float2, p: float2) {
  const sideAB = pointOnRightSideOfLine(a, b, p);
  const sideBC = pointOnRightSideOfLine(b, c, p);
  const sideCA = pointOnRightSideOfLine(c, a, p);
  return sideAB && sideBC && sideCA;
}
