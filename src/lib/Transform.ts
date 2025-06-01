import { Radians } from "../flavours";
import float3 from "./float3";

const { cos, sin } = Math;

export default class Transform {
  constructor(
    public position: float3 = new float3(0, 0, 0),
    public yaw: Radians = 0,
    public pitch: Radians = 0,
  ) {}

  toWorldPoint(p: float3) {
    const { i, j, k } = this.getBasisVectors();
    return this.transformVector(i, j, k, p).add(this.position);
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

  transformVector(i: float3, j: float3, k: float3, v: float3) {
    return i.mul(v.x).add(j.mul(v.y)).add(k.mul(v.z));
  }
}
