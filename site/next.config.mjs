import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(here, "..");

/** The site is a static export. Naksha is read straight from the repo it lives in: the built package in ../dist,
    the component READMEs and previews in ../artifact, the changelog and roadmap at the root. */
export default {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  outputFileTracingRoot: repo,
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Naksha's build keeps react and react-aria-components external. React is already Next's own;
      // react-aria-components must come from this folder too, so there is one copy of each.
      naksha$: path.join(repo, "dist/js/naksha.js"),
      "react-aria-components$": path.join(here, "node_modules/react-aria-components"),
    };
    return config;
  },
};
