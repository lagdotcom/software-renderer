import { Pixels } from "../flavours";

interface CanvasContextTypes {
  "2d": {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    options: CanvasRenderingContext2DSettings;
  };
  bitmaprenderer: {
    canvas: HTMLCanvasElement;
    context: ImageBitmapRenderingContext;
    options: ImageBitmapRenderingContextSettings;
  };
  webgl: {
    canvas: HTMLCanvasElement;
    context: WebGLRenderingContext;
    options: WebGLContextAttributes;
  };
  webgl2: {
    canvas: HTMLCanvasElement;
    context: WebGL2RenderingContext;
    options: WebGLContextAttributes;
  };

  offscreen: {
    canvas: OffscreenCanvas;
    context: OffscreenCanvasRenderingContext2D;
    options: unknown;
  };
}

type CanvasContextId = keyof CanvasContextTypes;

export default function makeCanvas<T extends CanvasContextId>(
  width: Pixels,
  height: Pixels,
  id: T,
  options?: CanvasContextTypes[T]["options"],
): [CanvasContextTypes[T]["canvas"], CanvasContextTypes[T]["context"]] {
  if (id === "offscreen") {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d", options);
    if (!ctx)
      throw new Error(`Could not get ${id} context for OffscreenCanvas`);

    return [canvas, ctx];
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext(id, options);
  if (!ctx) throw new Error(`Could not get ${id} context for canvas`);

  return [canvas, ctx];
}
