/*eslint-env node*/

import { context } from "esbuild";

import config from "./buildConfig.mjs";

const result = await context(config);
const serve = await result.serve({ servedir: "docs", port: 8080 });

for (const host of serve.hosts)
  console.log(
    `Serving: http://${host === "0.0.0.0" ? "localhost" : host}:${serve.port}`
  );
