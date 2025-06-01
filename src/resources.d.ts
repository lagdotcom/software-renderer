declare module "*.obj" {
  const data: import("./flavours").WavefrontObjData;
  export default data;
}
