// Naksha component bundle. Two outputs from src/:
//   dist/js/naksha.js (+ .d.ts)            ES module for products; react, react-dom and react-aria-components stay external
//   dist/artifact/components/bundle.js     one classic script for the Claude artifact: sets window.Naksha, reads window.React
// Also copies React 18.3.1 into dist/artifact/components/lib so previews never depend on a CDN.
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const define = { __NAKSHA_VERSION__: JSON.stringify(pkg.version), "process.env.NODE_ENV": '"production"' };
const NAMESPACE = "Naksha";

// 1. ES module
await build({
  entryPoints: [join(ROOT, "src/index.ts")], bundle: true, format: "esm", platform: "browser", target: "es2022",
  outfile: join(ROOT, "dist/js/naksha.js"), external: ["react", "react-dom", "react/jsx-runtime", "react-aria-components"],
  define: { __NAKSHA_VERSION__: define.__NAKSHA_VERSION__ }, logLevel: "error",
});

// 2. Types
execFileSync(process.execPath, [join(ROOT, "node_modules/typescript/bin/tsc"), "-p", join(ROOT, "tsconfig.json")], { stdio: "inherit" });
const typesDir = join(ROOT, "dist/types");
for (const f of readdirSync(typesDir)) copyFileSync(join(typesDir, f), join(ROOT, "dist/js", f.replace(/^index\.d\.ts$/, "naksha.d.ts")));

// 3. Artifact bundle: React comes from the page (window.React, window.ReactDOM)
const fromWindow = {
  name: "react-from-window",
  setup(b) {
    b.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, (a) => ({ path: a.path, namespace: "window" }));
    b.onLoad({ filter: /.*/, namespace: "window" }, (a) => {
      if (a.path === "react/jsx-runtime") {
        return { contents: "const R=window.React;function j(t,p,k){const{children,...r}=p||{};return k!==undefined?R.createElement(t,{...r,key:k},children):R.createElement(t,r,children)}module.exports={jsx:j,jsxs:j,Fragment:R.Fragment}" };
      }
      return { contents: a.path.startsWith("react-dom") ? "module.exports=window.ReactDOM" : "module.exports=window.React" };
    });
  },
};
const components = JSON.parse(readFileSync(join(ROOT, "src/components.json"), "utf8"));
const res = await build({
  entryPoints: [join(ROOT, "src/index.ts")], bundle: true, format: "iife", globalName: NAMESPACE, platform: "browser",
  target: "es2020", minify: true, write: false, plugins: [fromWindow], define, logLevel: "error", legalComments: "none",
});
let code = res.outputFiles[0].text;
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: NAMESPACE, components: components.map((name) => ({ name })) })} */`;
code = `${header}\n${code.replace(/var Naksha=/, "window.Naksha=")}`;
for (const bad of ["</script", "<!--"]) {
  if (code.toLowerCase().includes(bad)) throw new Error(`Artifact bundle contains "${bad}", which would break inlining.`);
}
const art = join(ROOT, "dist/artifact/components");
mkdirSync(join(art, "lib"), { recursive: true });
writeFileSync(join(art, "bundle.js"), code);

// 4. Types for the artifact's API cards
writeFileSync(join(art, "index.d.ts"), readdirSync(typesDir).filter((f) => f.endsWith(".d.ts")).map((f) => `// ${f}\n${readFileSync(join(typesDir, f), "utf8")}`).join("\n"));

// 5. React 18.3.1 for previews
for (const [mod, file] of [["react", "react.production.min.js"], ["react-dom", "react-dom.production.min.js"]]) {
  const src = join(ROOT, "node_modules", mod, "umd", file);
  if (!existsSync(src)) throw new Error(`Missing ${src}. React 18 ships UMD builds; React 19 does not.`);
  const v = JSON.parse(readFileSync(join(ROOT, "node_modules", mod, "package.json"), "utf8")).version;
  if (v !== "18.3.1") throw new Error(`${mod} is ${v}; the artifact expects 18.3.1.`);
  copyFileSync(src, join(art, "lib", file));
}
console.log(`bundled ${components.length} components -> dist/js/naksha.js, dist/artifact/components/bundle.js (${(code.length / 1024).toFixed(1)} KB)`);
