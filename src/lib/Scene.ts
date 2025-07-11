import { clamp } from "../tools/clamp";
import Camera from "./Camera";
import float2 from "./float2";
import float3 from "./float3";
import { ceil, floor, max, min, pointInTriangle, tan } from "./maths";
import Model, { Triangle } from "./Model";
import RenderTarget from "./RenderTarget";
import Transform from "./Transform";

export default class Scene {
  centre: float2;

  constructor(
    public renderTarget: RenderTarget,
    public camera: Camera,
    public models: Model[],
  ) {
    this.centre = renderTarget.size.div(2);
  }

  render(debug: (line: string) => void) {
    const { models, renderTarget } = this;
    const { width, height } = renderTarget;

    for (const model of models) {
      debug(model.toString());

      this.processModel(model);

      for (let i = 0; i < model.rasterPoints.length; i += 3) {
        const [r0, r1, r2] = model.rasterPoints.slice(i, i + 3);
        const a = r0.screenPosition;
        const b = r1.screenPosition;
        const c = r2.screenPosition;

        const minX = min(a.x, b.x, c.x);
        const minY = min(a.y, b.y, c.y);
        const maxX = max(a.x, b.x, c.x);
        const maxY = max(a.y, b.y, c.y);

        const blockStartX = clamp(floor(minX), 0, width - 1);
        const blockStartY = clamp(floor(minY), 0, height - 1);
        const blockEndX = clamp(ceil(maxX), 0, width - 1);
        const blockEndY = clamp(ceil(maxY), 0, height - 1);

        const invDepths = new float3(1 / r0.depth, 1 / r1.depth, 1 / r2.depth);
        const tx = r0.textureCoords.mul(invDepths.x);
        const ty = r1.textureCoords.mul(invDepths.y);
        const tz = r2.textureCoords.mul(invDepths.z);
        const nx = r0.normals.mul(invDepths.x);
        const ny = r1.normals.mul(invDepths.y);
        const nz = r2.normals.mul(invDepths.z);

        for (let y = blockStartY; y <= blockEndY; y++)
          for (let x = blockStartX; x <= blockEndX; x++) {
            const p = new float2(x, y);
            const [inside, weights] = pointInTriangle(a, b, c, p);
            if (inside) {
              const depth =
                1 /
                (invDepths.x * weights.x +
                  invDepths.y * weights.y +
                  invDepths.z * weights.z);
              if (renderTarget.depthTest(x, y, depth)) continue;

              const texCoord = tx
                .mul(weights.x)
                .add(ty.mul(weights.y))
                .add(tz.mul(weights.z))
                .mul(depth);
              const normal = nx
                .mul(weights.x)
                .add(ny.mul(weights.y))
                .add(nz.mul(weights.z))
                .mul(depth);

              const col = model.shader.getPixelColour(
                texCoord,
                normal,
                depth,
                r0.triangle,
              );
              renderTarget.plotAtDepth(x, y, depth, col);
            }
          }
      }
    }
  }

  vertexToView(v: float3, transform: Transform) {
    const world = transform.toWorldPoint(v);
    const view = this.camera.transform.toLocalPoint(world);
    return view;
  }

  viewToScreen(view: float3) {
    const { camera, renderTarget } = this;

    const screenHeightWorld = tan(camera.fov / 2) * 2;
    const pixelsPerWorldUnit = renderTarget.size.y / screenHeightWorld / view.z;
    const pixelOffset = view.xy.mul(pixelsPerWorldUnit);
    return renderTarget.size.div(2).add(pixelOffset);
  }

  processModel(model: Model) {
    model.rasterPoints = [];

    for (const triangle of model.triangles) {
      const viewPoints = triangle.vertices.map((v) =>
        this.vertexToView(v, model.transform),
      );

      const nearClipDistance = 0.01;
      const clip0 = viewPoints[0].z <= nearClipDistance;
      const clip1 = viewPoints[1].z <= nearClipDistance;
      const clip2 = viewPoints[2].z <= nearClipDistance;
      const clipCount = boolToInt(clip0) + boolToInt(clip1) + boolToInt(clip2);

      switch (clipCount) {
        case 0:
          this.addRasterPoint(model, viewPoints[0], triangle, 0);
          this.addRasterPoint(model, viewPoints[1], triangle, 1);
          this.addRasterPoint(model, viewPoints[2], triangle, 2);
          continue;

        case 1: {
          const indexClip = clip0 ? 0 : clip1 ? 1 : 2;
          const indexNext = (indexClip + 1) % 3;
          const indexPrev = (indexClip - 1 + 3) % 3;

          const pointClipped = viewPoints[indexClip];
          const pointA = viewPoints[indexNext];
          const pointB = viewPoints[indexPrev];

          const fracA =
            (nearClipDistance - pointClipped.z) / (pointA.z - pointClipped.z);
          const fracB =
            (nearClipDistance - pointClipped.z) / (pointB.z - pointClipped.z);

          const clipPointAlongEdgeA = float3.lerp(pointClipped, pointA, fracA);
          const clipPointAlongEdgeB = float3.lerp(pointClipped, pointB, fracB);

          this.addInterpolatedRasterPoint(
            model,
            clipPointAlongEdgeB,
            triangle,
            indexClip,
            indexPrev,
            fracB,
          );
          this.addInterpolatedRasterPoint(
            model,
            clipPointAlongEdgeA,
            triangle,
            indexClip,
            indexNext,
            fracA,
          );
          this.addRasterPoint(model, pointB, triangle, indexPrev);

          this.addInterpolatedRasterPoint(
            model,
            clipPointAlongEdgeA,
            triangle,
            indexClip,
            indexNext,
            fracA,
          );
          this.addRasterPoint(model, pointA, triangle, indexNext);
          this.addRasterPoint(model, pointB, triangle, indexPrev);
          continue;
        }

        case 2: {
          const indexNonClip = !clip0 ? 0 : !clip1 ? 1 : 2;
          const indexNext = (indexNonClip + 1) % 3;
          const indexPrev = (indexNonClip - 1 + 3) % 3;

          const pointNotClipped = viewPoints[indexNonClip];
          const pointA = viewPoints[indexNext];
          const pointB = viewPoints[indexPrev];

          const fracA =
            (nearClipDistance - pointNotClipped.z) /
            (pointA.z - pointNotClipped.z);
          const fracB =
            (nearClipDistance - pointNotClipped.z) /
            (pointB.z - pointNotClipped.z);

          const clipPointAlongEdgeA = float3.lerp(
            pointNotClipped,
            pointA,
            fracA,
          );
          const clipPointAlongEdgeB = float3.lerp(
            pointNotClipped,
            pointB,
            fracB,
          );

          this.addInterpolatedRasterPoint(
            model,
            clipPointAlongEdgeB,
            triangle,
            indexNonClip,
            indexPrev,
            fracB,
          );
          this.addRasterPoint(model, pointNotClipped, triangle, indexNonClip);
          this.addInterpolatedRasterPoint(
            model,
            clipPointAlongEdgeA,
            triangle,
            indexNonClip,
            indexNext,
            fracA,
          );
        }
      }
    }
  }

  addRasterPoint(
    model: Model,
    viewPoint: float3,
    triangle: Triangle,
    index: number,
  ) {
    model.rasterPoints.push({
      triangle,
      depth: viewPoint.z,
      screenPosition: this.viewToScreen(viewPoint),
      textureCoords: triangle.textureCoords[index] ?? float2.zero,
      normals: triangle.normals[index],
    });
  }

  addInterpolatedRasterPoint(
    model: Model,
    viewPoint: float3,
    triangle: Triangle,
    indexA: number,
    indexB: number,
    t: number,
  ) {
    const texCoordA = triangle.textureCoords[indexA] ?? float2.zero;
    const texCoordB = triangle.textureCoords[indexB] ?? float2.zero;

    model.rasterPoints.push({
      triangle,
      depth: viewPoint.z,
      screenPosition: this.viewToScreen(viewPoint),
      textureCoords: float2.lerp(texCoordA, texCoordB, t),
      normals: float3.lerp(
        triangle.normals[indexA],
        triangle.normals[indexB],
        t,
      ),
    });
  }
}

const boolToInt = (b: boolean) => (b ? 1 : 0);
