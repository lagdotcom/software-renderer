import { clamp } from "../tools/clamp";
import Camera from "./Camera";
import float2 from "./float2";
import float3 from "./float3";
import { ceil, floor, max, min, pointInTriangle, tan } from "./maths";
import Model from "./Model";
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

      for (const triangle of model.triangles) {
        const [a, b, c] = triangle.vertices.map((v) =>
          this.vertexToScreen(v, model.transform),
        );
        if (a.z <= 0 || b.z <= 0 || c.z <= 0) continue;

        const minX = min(a.x, b.x, c.x);
        const minY = min(a.y, b.y, c.y);
        const maxX = max(a.x, b.x, c.x);
        const maxY = max(a.y, b.y, c.y);

        const startX = clamp(floor(minX), 0, width - 1);
        const startY = clamp(floor(minY), 0, height - 1);
        const endX = clamp(ceil(maxX), 0, width - 1);
        const endY = clamp(ceil(maxY), 0, height - 1);

        for (let y = startY; y <= endY; y++)
          for (let x = startX; x <= endX; x++) {
            const [inside, weights] = pointInTriangle(
              a.xy,
              b.xy,
              c.xy,
              new float2(x, y),
            );
            if (inside) {
              const depths = new float3(a.z, b.z, c.z);
              const depth = 1 / float3.dot(depths.reciprocal(), weights);
              if (renderTarget.depthTest(x, y, depth)) continue;

              let texCoord = float2.zero;
              if (triangle.textureCoords.length >= 3)
                texCoord = texCoord
                  .add(
                    triangle.textureCoords[0]
                      .abs()
                      .div(depths.x)
                      .mul(weights.x),
                  )
                  .add(
                    triangle.textureCoords[1]
                      .abs()
                      .div(depths.y)
                      .mul(weights.y),
                  )
                  .add(
                    triangle.textureCoords[2]
                      .abs()
                      .div(depths.z)
                      .mul(weights.z),
                  )
                  .mul(depth);

              const normal = float3.zero
                .add(triangle.normals[0].div(depths.x).mul(weights.x))
                .add(triangle.normals[1].div(depths.y).mul(weights.y))
                .add(triangle.normals[2].div(depths.z).mul(weights.z))
                .mul(depth);

              renderTarget.plotAtDepth(
                x,
                y,
                depth,
                model.shader.getPixelColour(texCoord, normal, triangle),
              );
            }
          }
      }
    }
  }

  vertexToScreen(v: float3, transform: Transform) {
    const { camera, centre, renderTarget } = this;

    const size = renderTarget.size;
    const world = transform.toWorldPoint(v);
    const view = camera.transform.toLocalPoint(world);

    const screenHeightWorld = tan(camera.fov / 2) * 2;
    const pixelsPerWorldUnit = size.y / screenHeightWorld / view.z;

    const pixelOffset = view.xy.mul(pixelsPerWorldUnit);
    const screen = centre.add(pixelOffset);
    return new float3(screen.x, screen.y, view.z);
  }
}
