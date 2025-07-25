import { Radians } from "../flavours";
import float2 from "./float2";
import float3 from "./float3";
import RasterPoint from "./RasterPoint";
import Shader from "./Shader";
import Transform from "./Transform";

export interface ModelJson {
  materialFile?: string;
  vertices: [x: number, y: number, z: number, w: number][];
  textureCoords: [u: number, v: number][];
  vertexNormals: [x: number, y: number, z: number][];
  triangles: {
    material?: string;
    vertexIndices: number[];
    textureIndices: number[];
    normalIndices: number[];
  }[];
}

export interface Triangle {
  index: number;
  material?: string;
  vertices: float3[];
  vertexIndices: number[];
  textureCoords: float2[];
  textureIndices: number[];
  normals: float3[];
  normalIndices: number[];
}

export default class Model {
  vertices: float3[];
  textureCoords: float2[];
  vertexNormals: float3[];
  triangles: Triangle[];
  rasterPoints: RasterPoint[];

  constructor(
    public name: string,
    json: ModelJson,
    public shader: Shader,
    public transform = new Transform(),
  ) {
    this.vertices = json.vertices.map(([x, y, z]) => new float3(x, y, z));
    this.textureCoords = json.textureCoords.map(([u, v]) => new float2(u, v));
    this.vertexNormals = json.vertexNormals.map(
      ([x, y, z]) => new float3(x, y, z),
    );
    this.triangles = json.triangles.map((t, index) => ({
      ...t,
      index,
      vertices: t.vertexIndices.map((i) => this.vertices[i]),
      textureCoords: t.textureIndices.map((i) => this.textureCoords[i]),
      normals: t.normalIndices.map((i) => this.vertexNormals[i]),
    }));
    this.rasterPoints = [];
  }

  toString() {
    return `${this.name} ${this.transform.toString()}`;
  }

  translate(x = 0, y = 0, z = 0) {
    this.transform.position.x += x;
    this.transform.position.y += y;
    this.transform.position.z += z;
    return this;
  }

  scale(x: number, y = x, z = y) {
    this.transform.scale.x *= x;
    this.transform.scale.y *= y;
    this.transform.scale.z *= z;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rotate(x: Radians = 0, y: Radians = 0, z: Radians = 0) {
    this.transform.yaw += x;
    this.transform.pitch += y;
    // TODO roll
    return this;
  }
}
