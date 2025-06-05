import float2 from "./float2";
import Shader from "./Shader";
import Texture from "./Texture";

export default class TextureShader implements Shader {
  constructor(public texture: Texture) {}

  getPixelColour(texCoord: float2) {
    return this.texture.sample(texCoord);
  }
}
