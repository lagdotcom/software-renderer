import { Degrees, Radians } from "../flavours";
import { toDegrees, toRadians } from "./maths";
import Transform from "./Transform";

export default class Camera {
  fov: Radians;

  constructor(
    fov: Degrees,
    public transform = new Transform(),
  ) {
    this.fov = toRadians(fov);
  }

  toString() {
    return `CAMERA fov=${toDegrees(this.fov)} ${this.transform.toString()}`;
  }
}
