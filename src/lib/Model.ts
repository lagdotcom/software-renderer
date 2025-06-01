import float2 from "./float2";
import float3 from "./float3";

export interface ModelJson {
  vertices: [x: number, y: number, z: number, w: number][];
  textureCoords: [u: number, v: number][];
  vertexNormals: [x: number, y: number, z: number][];
  triangles: {
    vertexIndices: number[];
    textureIndices: number[];
    normalIndices: number[];
  }[];
}

export interface Triangle {
  vertices: float3[];
  vertexIndices: number[];
  textureIndices: number[];
  normalIndices: number[];
}

export default class Model {
  vertices: float3[];
  textureCoords: float2[];
  vertexNormals: float3[];
  triangles: Triangle[];

  constructor(json: ModelJson) {
    this.vertices = json.vertices.map(([x, y, z]) => new float3(x, y, z));
    this.textureCoords = json.textureCoords.map(([u, v]) => new float2(u, v));
    this.vertexNormals = json.vertexNormals.map(
      ([x, y, z]) => new float3(x, y, z),
    );
    this.triangles = json.triangles.map(
      ({ vertexIndices, textureIndices, normalIndices }) => ({
        vertexIndices,
        textureIndices,
        normalIndices,
        vertices: vertexIndices.map((i) => this.vertices[i]),
      }),
    );
  }
}
