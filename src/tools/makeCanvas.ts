import { Pixels } from "../flavours";

interface CanvasContextTypes {
  "2d": {
    context: CanvasRenderingContext2D;
    options: CanvasRenderingContext2DSettings;
  };
  bitmaprenderer: {
    context: ImageBitmapRenderingContext;
    options: ImageBitmapRenderingContextSettings;
  };
  webgl: { context: WebGLRenderingContext; options: WebGLContextAttributes };
  webgl2: { context: WebGL2RenderingContext; options: WebGLContextAttributes };
}

type CanvasContextId = keyof CanvasContextTypes;

export default function makeCanvas<T extends CanvasContextId>(
  width: Pixels,
  height: Pixels,
  id: T,
  options?: CanvasContextTypes[T]["options"],
): [HTMLCanvasElement, CanvasContextTypes[T]["context"]] {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext(id, options);
  if (!ctx) throw new Error(`Could not get ${id} context for canvas`);

  return [canvas, ctx];
}
