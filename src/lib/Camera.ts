import { Degrees, Radians } from "../flavours";
import { toRadians } from "./maths";
import Transform from "./Transform";

export default class Camera {
  fov: Radians;

  constructor(
    fov: Degrees,
    public transform = new Transform(),
  ) {
    this.fov = toRadians(fov);
  }
}
