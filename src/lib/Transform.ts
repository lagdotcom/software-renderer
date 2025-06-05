import { Radians } from "../flavours";
import float3 from "./float3";
import { cos, sin, toDegrees } from "./maths";

export default class Transform {
  constructor(
    public position: float3 = new float3(0, 0, 0),
    public scale: float3 = new float3(1, 1, 1),
    public yaw: Radians = 0,
    public pitch: Radians = 0,
  ) {}

  toString() {
    return `T[pos=${this.position.toString()} yaw=${toDegrees(this.yaw).toFixed(2)} pitch=${toDegrees(this.pitch).toFixed(2)}]`;
  }

  toWorldPoint(localPoint: float3) {
    let { i, j, k } = this.getBasisVectors();
    i = i.mul(this.scale.x);
    j = j.mul(this.scale.y);
    k = k.mul(this.scale.z);
    return this.transformVector(i, j, k, localPoint).add(this.position);
  }

  toLocalPoint(worldPoint: float3) {
    const { i, j, k } = this.getInverseBasisVectors();
    return this.transformVector(i, j, k, worldPoint.sub(this.position)).div(
      this.scale.x,
      this.scale.y,
      this.scale.z,
    );
  }

  getBasisVectors() {
    const { yaw, pitch } = this;

    const iYaw = new float3(cos(yaw), 0, sin(yaw));
    const jYaw = new float3(0, 1, 0);
    const kYaw = new float3(-sin(yaw), 0, cos(yaw));

    const iPitch = new float3(1, 0, 0);
    const jPitch = new float3(0, cos(pitch), -sin(pitch));
    const kPitch = new float3(0, sin(pitch), cos(pitch));

    const i = this.transformVector(iYaw, jYaw, kYaw, iPitch);
    const j = this.transformVector(iYaw, jYaw, kYaw, jPitch);
    const k = this.transformVector(iYaw, jYaw, kYaw, kPitch);
    return { i, j, k };
  }

  getInverseBasisVectors() {
    const { i, j, k } = this.getBasisVectors();
    const ii = new float3(i.x, j.x, k.x);
    const ji = new float3(i.y, j.y, k.y);
    const ki = new float3(i.z, j.z, k.z);
    return { i: ii, j: ji, k: ki };
  }

  transformVector(i: float3, j: float3, k: float3, v: float3) {
    return i.mul(v.x).add(j.mul(v.y)).add(k.mul(v.z));
  }
}
