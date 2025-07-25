import { Degrees, Intensity, Milliseconds, Pixels } from "./flavours";
import Camera from "./lib/Camera";
import float2 from "./lib/float2";
import float3 from "./lib/float3";
import {
  createImage,
  createTestImage01,
  createTestImage02,
} from "./lib/helpers";
import { ceil, floor, max, min, pointInTriangle, toRadians } from "./lib/maths";
import Model from "./lib/Model";
import { MathRNG } from "./lib/Random";
import RenderTarget from "./lib/RenderTarget";
import Scene from "./lib/Scene";
import { clamp } from "./tools/clamp";
import enumerate from "./tools/enumerate";

export function showTestImages(ctx: CanvasRenderingContext2D) {
  {
    const image = createTestImage01(128, 128);
    paste(ctx, image, 10, 10);
  }

  {
    const image = createTestImage02(128, 128, [
      new float2(0.2, 0.2),
      new float2(0.7, 0.4),
      new float2(0.4, 0.8),
    ]);
    paste(ctx, image, 148, 10);
  }
}

export function bouncyTriangles(ctx: CanvasRenderingContext2D, count = 150) {
  const { width, height } = ctx.canvas;
  const halfSize = new float2(width / 2, height / 2);
  const rng = new MathRNG();

  const randomPoint = () =>
    halfSize.add(float2.random(rng, width, height).sub(halfSize).mul(0.3));

  const randomTriangle = () => {
    const points = [randomPoint(), randomPoint(), randomPoint()];
    const velocity = float2.random(rng, width, height).sub(halfSize).mul(0.04);
    const colour = float3.random<Intensity>(rng, 1, 1, 1);
    return { points, velocities: [velocity, velocity, velocity], colour };
  };

  const triangles = enumerate(count).map(randomTriangle);

  const black = new float3(0, 0, 0);

  const render = () => {
    const image = createImage(width, height, () => black);

    for (const triangle of triangles) {
      const [a, b, c] = triangle.points;

      const minX = min(a.x, b.x, c.x);
      const minY = min(a.y, b.y, c.y);
      const maxX = max(a.x, b.x, c.x);
      const maxY = max(a.y, b.y, c.y);

      const startX = clamp(floor(minX), 0, width - 1);
      const startY = clamp(floor(minY), 0, height - 1);
      const endX = clamp(ceil(maxX), 0, width - 1);
      const endY = clamp(ceil(maxY), 0, height - 1);

      for (let y = startY; y <= endY; y++)
        for (let x = startX; x <= endX; x++)
          if (pointInTriangle(a, b, c, new float2(x, y))[0])
            image[y][x] = triangle.colour;
    }

    paste(ctx, image, 0, 0);
  };

  const tick = () => {
    for (const triangle of triangles) {
      for (let i = 0; i < 3; i++) {
        const oldPoint = triangle.points[i];

        const point = oldPoint.add(triangle.velocities[i]);
        triangle.points[i] = point;

        if (point.x < 0 || point.x >= width)
          triangle.velocities[i] = triangle.velocities[i].mul(-1, 1);
        if (point.y < 0 || point.y >= height)
          triangle.velocities[i] = triangle.velocities[i].mul(1, -1);
      }
    }

    render();
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function paste(
  ctx: CanvasRenderingContext2D,
  image: float3<Intensity>[][],
  x: Pixels,
  y: Pixels,
) {
  ctx.putImageData(toImageData(image), x, y);
}

function toImageData(image: float3<Intensity>[][]) {
  const height = image.length;
  const width = image[0].length;
  const bytes = new Uint8ClampedArray(width * height * 4);
  let i = 0;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const { r, g, b } = image[y][x];
      bytes[i] = r * 255;
      bytes[i + 1] = g * 255;
      bytes[i + 2] = b * 255;
      bytes[i + 3] = 255;
      i += 4;
    }

  return new ImageData(bytes, width, height);
}

function addKeyHandler(element: HTMLElement = document.body) {
  const keys = new Set<string>();

  element.addEventListener("keydown", (e) => keys.add(e.key));
  element.addEventListener("keyup", (e) => keys.delete(e.key));

  return keys;
}

function addMouseHandler(element: HTMLElement = document.body) {
  const mouse = new float2<Pixels>(0, 0);

  element.addEventListener("mousemove", (e) => {
    mouse.x += e.movementX;
    mouse.y += e.movementY;
  });

  return () => {
    const { x, y } = mouse;
    mouse.x = 0;
    mouse.y = 0;

    return new float2(x, y);
  };
}

function addDebugBox(parent: HTMLElement = document.body) {
  const box = document.createElement("textarea");
  box.readOnly = true;
  box.cols = 80;
  box.rows = 10;
  parent.append(box);

  const clear = () => (box.innerHTML = "");
  const add = (line: string) =>
    (box.innerHTML = (box.innerHTML + "\n" + line).trim());

  return { clear, add };
}

export function modelDemo(
  ctx: CanvasRenderingContext2D,
  models: Model[],
  fov: Degrees = 60,
) {
  const { width, height } = ctx.canvas;
  const renderTarget = new RenderTarget(width, height);
  const camera = new Camera(fov);
  const scene = new Scene(renderTarget, camera, models);
  const keys = addKeyHandler();
  const getMouseUpdate = addMouseHandler();
  const debug = addDebugBox();

  const mouseSensitivity = 0.0002;
  const camSpeed = 0.8;
  const minPitch = toRadians(-85);
  const maxPitch = toRadians(85);
  const update = (delta: Milliseconds) => {
    const mouseDelta = getMouseUpdate().mul(mouseSensitivity * delta);
    camera.transform.pitch = clamp(
      camera.transform.pitch - mouseDelta.y,
      minPitch,
      maxPitch,
    );
    camera.transform.yaw -= mouseDelta.x;

    let moveDelta = float3.zero;
    const { i: right, j: up, k: forward } = camera.transform.getBasisVectors();

    if (keys.has("w")) moveDelta = moveDelta.add(forward);
    if (keys.has("s")) moveDelta = moveDelta.sub(forward);
    if (keys.has("d")) moveDelta = moveDelta.add(right);
    if (keys.has("a")) moveDelta = moveDelta.sub(right);
    if (keys.has("e")) moveDelta = moveDelta.add(up);
    if (keys.has("q")) moveDelta = moveDelta.sub(up);

    camera.transform.position = camera.transform.position.add(
      moveDelta.normalize().mul(camSpeed * delta),
    );
    // camera.transform.position.y = 1;
    debug.add(camera.toString());
  };

  let time: Milliseconds = performance.now();
  const tick = (newTime: DOMHighResTimeStamp) => {
    const delta = newTime - time;
    time = newTime;

    debug.clear();
    update(delta);
    renderTarget.clear();
    scene.render(debug.add);
    ctx.putImageData(renderTarget.data, 0, 0);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).models = models;
}
