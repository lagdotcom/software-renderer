import { Intensity, Pixels, Radians } from "./flavours";
import float2 from "./lib/float2";
import float3 from "./lib/float3";
import {
  createImage,
  createTestImage01,
  createTestImage02,
} from "./lib/helpers";
import { pointInTriangle } from "./lib/maths";
import Model from "./lib/Model";
import { MathRNG } from "./lib/Random";
import RenderTarget from "./lib/RenderTarget";
import Transform from "./lib/Transform";
import cubeObj from "./res/cube.obj";
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

      const minX = Math.min(a.x, b.x, c.x);
      const minY = Math.min(a.y, b.y, c.y);
      const maxX = Math.max(a.x, b.x, c.x);
      const maxY = Math.max(a.y, b.y, c.y);

      const startX = clamp(Math.floor(minX), 0, width - 1);
      const startY = clamp(Math.floor(minY), 0, height - 1);
      const endX = clamp(Math.ceil(maxX), 0, width - 1);
      const endY = clamp(Math.ceil(maxY), 0, height - 1);

      for (let y = startY; y <= endY; y++)
        for (let x = startX; x <= endX; x++)
          if (pointInTriangle(a, b, c, new float2(x, y)))
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

export function cubeDemo(ctx: CanvasRenderingContext2D, fov: Radians = 1) {
  const rng = new MathRNG();
  const triangleColours = enumerate(75).map(() =>
    float3.random<Intensity>(rng, 1, 1, 1),
  );
  const model = new Model(cubeObj);
  const { width, height } = ctx.canvas;
  const renderTarget = new RenderTarget(width, height);
  const transform = new Transform();
  transform.position.z = 5;

  const vertexToScreen = (v: float3) => {
    const size = renderTarget.size;
    const world = transform.toWorldPoint(v);

    const screenHeightWorld = Math.tan(fov / 2) * 2;
    const pixelsPerWorldUnit = size.y / screenHeightWorld / world.z;

    const pixelOffset = world.xy.mul(pixelsPerWorldUnit);
    return size.mul(0.5).add(pixelOffset);
  };

  const render = () => {
    renderTarget.clear();

    let ci = 0;
    for (const triangle of model.triangles) {
      const [a, b, c] = triangle.vertices.map(vertexToScreen);

      const minX = Math.min(a.x, b.x, c.x);
      const minY = Math.min(a.y, b.y, c.y);
      const maxX = Math.max(a.x, b.x, c.x);
      const maxY = Math.max(a.y, b.y, c.y);

      const startX = clamp(Math.floor(minX), 0, width - 1);
      const startY = clamp(Math.floor(minY), 0, height - 1);
      const endX = clamp(Math.ceil(maxX), 0, width - 1);
      const endY = clamp(Math.ceil(maxY), 0, height - 1);

      for (let y = startY; y <= endY; y++)
        for (let x = startX; x <= endX; x++)
          if (pointInTriangle(a, b, c, new float2(x, y)))
            renderTarget.plot(x, y, triangleColours[ci]);

      ci = (ci + 1) % triangleColours.length;
    }

    ctx.putImageData(renderTarget.data, 0, 0);
  };

  const tick = () => {
    render();
    requestAnimationFrame(tick);

    transform.yaw += 0.01;
    transform.pitch -= 0.005;
  };

  requestAnimationFrame(tick);
}
