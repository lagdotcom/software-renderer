import float2 from "./float2";
import float3 from "./float3";
import { Triangle } from "./Model";

export default interface RasterPoint {
  depth: number;
  screenPosition: float2;
  textureCoords: float2;
  normals: float3;
  triangle: Triangle;
}
