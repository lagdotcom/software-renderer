import { modelDemo } from "./demos";
import Model, { ModelJson } from "./lib/Model";
import cubeJson from "./res/cube.obj";
import skullJson from "./res/skull.obj";
import makeCanvas from "./tools/makeCanvas";

// see https://www.youtube.com/watch?v=yyJ-hdISgnw&t=1179s

window.addEventListener("load", initialise);
function initialise() {
  const [canvas, ctx] = makeCanvas(640, 480, "2d");
  document.body.append(canvas);

  const skull = new Model(skullJson).scale(0.5).translate(0, 0, 200);
  const cube = new Model(cubeJson).scale(20).translate(100, 0, 200);
  const cube2 = new Model(cubeJson).scale(20).translate(-100, 0, 200);
  const cube3 = new Model(cubeJson).scale(20).translate(100, 0, 100);
  const cube4 = new Model(cubeJson).scale(20).translate(-100, 0, 100);
  const floor = new Model(makeFlat(150, 30)).translate(0, 0, 150);

  modelDemo(ctx, [skull, cube, cube2, cube3, cube4, floor]);
}

function makeFlat(size: number, y = 0): ModelJson {
  return {
    vertices: [
      [-size, y, -size, 1],
      [size, y, -size, 1],
      [size, y, size, 1],
      [-size, y, size, 1],
    ],
    textureCoords: [],
    vertexNormals: [[0, 1, 0]],
    triangles: [
      {
        vertexIndices: [0, 1, 2],
        textureIndices: [],
        normalIndices: [1, 1, 1],
      },
      {
        vertexIndices: [0, 2, 3],
        textureIndices: [],
        normalIndices: [1, 1, 1],
      },
    ],
  };
}
