import { modelDemo } from "./demos";
import Model from "./lib/Model";
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

  modelDemo(ctx, [skull, cube, cube2, cube3, cube4]);
}
