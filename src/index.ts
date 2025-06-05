import { modelDemo } from "./demos";
import { toRadians } from "./lib/maths";
import { betta, cube, loadFlat, loadModel } from "./res";
import makeCanvas from "./tools/makeCanvas";

// see https://www.youtube.com/watch?v=yyJ-hdISgnw&t=1179s

window.addEventListener("load", initialise);
async function initialise() {
  const [canvas, ctx] = makeCanvas(640, 480, "2d");
  document.body.append(canvas);

  const models = [
    (await loadModel(betta))
      .scale(0.2)
      .translate(0, 0, 200)
      .rotate(toRadians(90), toRadians(90)),
    (await loadModel(cube)).scale(20).translate(100, 0, 200),
    (await loadModel(cube)).scale(20).translate(-100, 0, 200),
    (await loadModel(cube)).scale(20).translate(100, 0, 100),
    (await loadModel(cube)).scale(20).translate(-100, 0, 100),
    loadFlat("floor", 150, 30).translate(0, 0, 150),
  ];

  modelDemo(ctx, models);
}
