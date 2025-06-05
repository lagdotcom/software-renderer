declare module "*.obj" {
  const model: import("./lib/Model").ModelJson;
  export default model;
}

declare module "*.png" {
  const url: import("./flavours").TextureUrl;
  export default url;
}
