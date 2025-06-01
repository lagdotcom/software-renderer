import { cubeDemo } from "./demos";
import makeCanvas from "./tools/makeCanvas";

window.addEventListener("load", initialise);
function initialise() {
  const [canvas, ctx] = makeCanvas(640, 480, "2d");
  document.body.append(canvas);
  cubeDemo(ctx);
}
