/*eslint-env node*/

import { readFileSync } from "fs";
import path from "path";

/**
 * @param {string} raw
 */
export function parseObj(raw) {
  const vertices = [];
  const textureCoords = [];
  const vertexNormals = [];
  const triangles = [];
  var materialFile = undefined;
  var material = undefined;

  for (const lineRaw of raw.split("\n")) {
    const line = lineRaw.split("#")[0].trim();
    if (!line[0]) continue;

    const [cmd, ...args] = line.replace(/\s+/g, " ").split(" ");
    switch (cmd) {
      case "v": {
        const [x, y, z, w] = args.map(Number);
        vertices.push([x, y, z, w ?? 1]);
        break;
      }

      case "vt": {
        const [u, v] = args.map(Number);
        textureCoords.push([u, v ?? 0]);
        break;
      }

      case "vn": {
        const [x, y, z] = args.map(Number);
        vertexNormals.push([x, y, z]);
        break;
      }

      case "mtllib":
        materialFile = args.join("#");
        break;

      case "usemtl":
        material = args.join("#");
        break;

      case "f": {
        const face = {
          vertexIndices: [],
          textureIndices: [],
          normalIndices: [],
        };

        const add = (vertex, texture, normal) => {
          face.vertexIndices.push(vertex - 1);
          if (texture) face.textureIndices.push(texture - 1);
          if (normal) face.normalIndices.push(normal - 1);
        };

        const reuse = (offset) => {
          const vertex = face.vertexIndices.at(offset);
          const texture = face.textureIndices.at(offset);
          const normal = face.normalIndices.at(offset);

          face.vertexIndices.push(vertex);
          if (typeof texture !== "undefined") face.textureIndices.push(texture);
          if (typeof normal !== "undefined") face.normalIndices.push(normal);
        };

        for (const [i, group] of args.entries()) {
          const [vertex, texture, normal] = group.split("/").map(Number);
          if (i >= 3) {
            reuse(0);
            reuse(-2);
          }
          add(vertex, texture, normal);
        }

        for (let i = 0; i < face.vertexIndices.length; i += 3) {
          triangles.push({
            material,
            vertexIndices: face.vertexIndices.slice(i, i + 3),
            textureIndices: face.textureIndices.slice(i, i + 3),
            normalIndices: face.normalIndices.slice(i, i + 3),
          });
        }
      }
    }
  }

  return { materialFile, vertices, textureCoords, vertexNormals, triangles };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ObjModule = (options = {}) => ({
  name: "WavefrontObj",

  /**
   * @param {import("esbuild").PluginBuild} build
   */
  setup(build) {
    build.onResolve({ filter: /\.obj$/ }, (args) => {
      return {
        path: path.isAbsolute(args.path)
          ? args.path
          : path.join(args.resolveDir, args.path),
        namespace: "obj",
      };
    });

    build.onLoad({ filter: /.*/, namespace: "obj" }, (args) => {
      const raw = readFileSync(args.path, { encoding: "utf-8" });
      const model = parseObj(raw);

      return { loader: "json", contents: JSON.stringify(model) };
    });
  },
});
export default ObjModule;
