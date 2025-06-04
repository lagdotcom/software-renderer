import { modelDemo } from "./demos";
import { toRadians } from "./lib/maths";
import Model, { ModelJson } from "./lib/Model";
// import skullJson from "./res/skull.obj";
import bettaJson from "./res/betta.obj";
import cubeJson from "./res/cube.obj";
import makeCanvas from "./tools/makeCanvas";

// see https://www.youtube.com/watch?v=yyJ-hdISgnw&t=1179s

window.addEventListener("load", initialise);
function initialise() {
  const [canvas, ctx] = makeCanvas(640, 480, "2d");
  document.body.append(canvas);

  // const skull = new Model("skull", skullJson).scale(0.5).translate(0, 0, 200);
  const fish = new Model("betta", bettaJson)
    .scale(0.2)
    .translate(0, 0, 200)
    .rotate(toRadians(90), toRadians(90));
  const cube = new Model("cube", cubeJson).scale(20).translate(100, 0, 200);
  const cube2 = new Model("cube", cubeJson).scale(20).translate(-100, 0, 200);
  const cube3 = new Model("cube", cubeJson).scale(20).translate(100, 0, 100);
  const cube4 = new Model("cube", cubeJson).scale(20).translate(-100, 0, 100);
  const floor = new Model("floor", makeFlat(150, 30)).translate(0, 0, 150);

  modelDemo(ctx, [fish, cube, cube2, cube3, cube4, floor]);
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
