declare module "*.obj" {
  const model: import("./lib/Model").ModelJson;
  export default model;
}
