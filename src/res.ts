import { TextureUrl } from "./flavours";
import float3 from "./lib/float3";
import LitShader from "./lib/LitShader";
import LitTextureShader from "./lib/LitTextureShader";
import MaterialShader, { MaterialTextures } from "./lib/MaterialShader";
import Model, { ModelJson } from "./lib/Model";
import RandomShader from "./lib/RandomShader";
import Texture from "./lib/Texture";
import TextureShader from "./lib/TextureShader";
import Transform from "./lib/Transform";
import bettaJson from "./res/betta.obj";
import cubeJson from "./res/cube.obj";
import diceJson from "./res/cube-tex.obj";
import skullJson from "./res/skull.obj";
import bettaBodyUrl from "./res/textures/body_baseColor.png";
import diceTextureUrl from "./res/textures/cube.png";
import bettaEyesUrl from "./res/textures/eyes_baseColor.png";
import bettaFinBackUrl from "./res/textures/fin_back_baseColor.png";
import bettaFinDownUrl from "./res/textures/Fin_down_baseColor.png";
import bettaFinTopUrl from "./res/textures/fin_top_baseColor.png";
import makeCanvas from "./tools/makeCanvas";

interface ModelAndMaterials {
  name: string;
  json: ModelJson;
  shader?:
    | { type: "lit"; light: float3 }
    | { type: "litTexture"; light: float3; url: TextureUrl }
    | { type: "materials"; textureUrls: Record<string, TextureUrl> }
    | { type: "texture"; url: TextureUrl };
}

export const betta: ModelAndMaterials = {
  name: "betta",
  json: bettaJson,
  shader: {
    type: "materials",
    textureUrls: {
      body: bettaBodyUrl,
      fin_top: bettaFinTopUrl,
      fin_back: bettaFinBackUrl,
      Fin_down: bettaFinDownUrl,
      eyes: bettaEyesUrl,
    },
  },
};

export const cube: ModelAndMaterials = {
  name: "cube",
  json: cubeJson,
};

export const dice: ModelAndMaterials = {
  name: "dice",
  json: diceJson,
  shader: { type: "texture", url: diceTextureUrl },
};

export const skull: ModelAndMaterials = {
  name: "skull",
  json: skullJson,
};

export function changeShader(
  mm: ModelAndMaterials,
  shader: ModelAndMaterials["shader"],
) {
  return { ...mm, shader };
}

async function loadShader(sh: ModelAndMaterials["shader"]) {
  switch (sh?.type) {
    case "lit":
      return new LitShader(sh.light);

    case "litTexture":
      return new LitTextureShader(await loadTexture(sh.url), sh.light);

    case "materials":
      return new MaterialShader(await loadMtl(sh.textureUrls));

    case "texture":
      return new TextureShader(await loadTexture(sh.url));

    default:
      return new RandomShader();
  }
}

export async function loadModel(mm: ModelAndMaterials, transform?: Transform) {
  return new Model(mm.name, mm.json, await loadShader(mm.shader), transform);
}

export async function loadTexture(url: TextureUrl) {
  return new Promise<Texture>((resolve) => {
    const img = document.createElement("img");
    img.src = url;

    img.addEventListener("load", () => {
      const [, ctx] = makeCanvas(
        img.naturalWidth,
        img.naturalHeight,
        "offscreen",
      );
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
      resolve(new Texture(data));
    });
  });
}

export async function loadMtl(urls: Record<string, TextureUrl>) {
  const mtl: MaterialTextures = {};

  for (const [name, url] of Object.entries(urls))
    mtl[name] = await loadTexture(url);

  return mtl;
}

export function loadFlat(name: string, size: number, y = 0) {
  return new Model(name, makeFlat(size, y), new RandomShader());
}

function makeFlat(size: number, y = 0): ModelJson {
  return {
    vertices: [
      [-size, y, -size, 1],
      [size, y, -size, 1],
      [size, y, size, 1],
      [-size, y, size, 1],
    ],
    textureCoords: [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    vertexNormals: [[0, 1, 0]],
    triangles: [
      {
        vertexIndices: [0, 1, 2],
        textureIndices: [0, 1, 2],
        normalIndices: [0, 0, 0],
      },
      {
        vertexIndices: [0, 2, 3],
        textureIndices: [0, 2, 3],
        normalIndices: [0, 0, 0],
      },
    ],
  };
}
