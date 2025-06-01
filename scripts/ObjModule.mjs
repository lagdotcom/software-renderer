/*eslint-env node*/

import { readFileSync } from "fs";
import path from "path";

export function parseObj(raw) {
  const vertices = [];
  const textureCoords = [];
  const vertexNormals = [];
  const triangles = [];

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

      case "f": {
        if (args.length !== 3)
          throw new Error(
            `face has ${args.length} elements, figure out triangle fans`
          );

        const triangle = {
          vertexIndices: [],
          textureIndices: [],
          normalIndices: [],
        };

        for (const element of args) {
          const [vertex, texture, normal] = element.split("/").map(Number);
          triangle.vertexIndices.push(vertex - 1);
          if (texture) triangle.textureIndices.push(texture - 1);
          if (normal) triangle.normalIndices.push(normal - 1);
        }

        triangles.push(triangle);
      }
    }
  }

  return { vertices, textureCoords, vertexNormals, triangles };
}

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
