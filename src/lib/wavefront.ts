import { WavefrontObjData } from "../flavours";
import float2 from "./float2";
import float3 from "./float3";

export interface Model {
  vertices: float3[];
  textureCoords: float2[];
  vertexNormals: float3[];
  triangles: Triangle[];
}

export interface Triangle {
  vertices: float3[];
  vertexIndices: number[];
  textureIndices: number[];
  normalIndices: number[];
}

export function parseObj(raw: WavefrontObjData): Model {
  const vertices: float3[] = [];
  const textureCoords: float2[] = [];
  const vertexNormals: float3[] = [];
  const triangles: Triangle[] = [];

  for (const lineRaw of raw.split("\n")) {
    const line = lineRaw.split("#")[0].trim();
    if (!line[0]) continue;

    const [cmd, ...args] = line.replace(/\s+/g, " ").split(" ");
    switch (cmd) {
      case "v": {
        const [x, y, z] = args.map(Number);
        vertices.push(new float3(x, y, z));
        break;
      }

      case "vt": {
        const [u, v] = args.map(Number);
        textureCoords.push(new float2(u, v ?? 0));
        break;
      }

      case "vn": {
        const [x, y, z] = args.map(Number);
        vertexNormals.push(new float3(x, y, z));
        break;
      }

      case "f": {
        if (args.length !== 3)
          throw new Error(
            `face has ${args.length} elements, figure out triangle fans`,
          );

        const tri: Triangle = {
          vertices: [],
          vertexIndices: [],
          textureIndices: [],
          normalIndices: [],
        };

        for (const element of args) {
          const [vertex, texture, normal] = element.split("/").map(Number);
          tri.vertexIndices.push(vertex - 1);
          tri.vertices.push(vertices[vertex - 1]);
          tri.textureIndices.push(texture ? texture - 1 : NaN);
          tri.normalIndices.push(normal ? normal - 1 : NaN);
        }

        triangles.push(tri);
      }
    }
  }

  return { vertices, textureCoords, vertexNormals, triangles };
}
