import { modelDemo } from "./demos";
import float3 from "./lib/float3";
import { toRadians } from "./lib/maths";
import { changeShader, cube, dice, loadFlat, loadModel, skull } from "./res";
import makeCanvas from "./tools/makeCanvas";

// see https://www.youtube.com/watch?v=yyJ-hdISgnw&t=1179s

window.addEventListener("load", initialise);
async function initialise() {
  const [canvas, ctx] = makeCanvas(640, 480, "2d");
  document.body.append(canvas);

  const light = new float3(0, 1, 0);

  const models = [
    // (await loadModel(betta))
    //   .scale(0.2)
    //   .translate(0, 0, 200)
    //   .rotate(toRadians(90), toRadians(90)),
    (await loadModel(changeShader(skull, { type: "lit", light })))
      .scale(0.2)
      .rotate(toRadians(270), toRadians(180))
      .translate(0, 0, 100),
    (await loadModel(dice)).scale(20).translate(100, 0, 200),
    (await loadModel(dice)).scale(20).translate(-100, 0, 200),
    (await loadModel(cube)).scale(20).translate(100, 0, 100),
    (await loadModel(cube)).scale(20).translate(-100, 0, 100),
    loadFlat("floor", 150, 30).translate(0, 0, 150),
  ];

  modelDemo(ctx, models);
}
