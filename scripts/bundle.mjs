// Naksha component bundle. Two outputs from src/:
//   dist/js/naksha.js (+ .d.ts)            ES module for products; react, react-dom and react-aria-components stay external
//   dist/artifact/components/bundle.js     one classic script for the Claude artifact: sets window.Naksha, reads window.React
// Also copies React 18.3.1 into dist/artifact/components/lib so previews never depend on a CDN.
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, cpSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

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
cpSync(typesDir, join(ROOT, "dist/js"), { recursive: true });
writeFileSync(join(ROOT, "dist/js/naksha.d.ts"), readFileSync(join(typesDir, "index.d.ts"), "utf8"));

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
// One flat file: the artifact reads <Comp>Props from here. Import and re-export lines are dropped; IconName becomes a plain union.
const { ICONS } = await import(pathToFileURL(join(ROOT, "src/icons.generated.ts")).href).catch(() => ({ ICONS: null }));
const iconNames = Object.keys(ICONS ?? JSON.parse(readFileSync(join(ROOT, "src/icons.generated.ts"), "utf8").match(/ICONS = (\{[\s\S]*?\}) as const/)[1]));
const flat = [`/** Naksha ${pkg.version}. Props for every component in window.Naksha. */`, `export type IconName = ${iconNames.map((n) => JSON.stringify(n)).join(" | ")};`];
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith(".d.ts") ? [join(d, e.name)] : []));
for (const f of walk(typesDir).filter((f) => !/index\.d\.ts$|icons\.generated\.d\.ts$|cx\.d\.ts$/.test(f)).sort()) {
  const body = readFileSync(f, "utf8").split("\n").filter((l) => !/^import |^export \{|^export type \{|^export \*/.test(l)).join("\n").trim();
  if (body) flat.push(`// ${f.slice(typesDir.length + 1)}\n${body}`);
}
writeFileSync(join(art, "index.d.ts"), flat.join("\n\n") + "\n");

// 5. React 18.3.1 for previews
for (const [mod, file] of [["react", "react.production.min.js"], ["react-dom", "react-dom.production.min.js"]]) {
  const src = join(ROOT, "node_modules", mod, "umd", file);
  if (!existsSync(src)) throw new Error(`Missing ${src}. React 18 ships UMD builds; React 19 does not.`);
  const v = JSON.parse(readFileSync(join(ROOT, "node_modules", mod, "package.json"), "utf8")).version;
  if (v !== "18.3.1") throw new Error(`${mod} is ${v}; the artifact expects 18.3.1.`);
  copyFileSync(src, join(art, "lib", file));
}
console.log(`bundled ${components.length} components -> dist/js/naksha.js, dist/artifact/components/bundle.js (${(code.length / 1024).toFixed(1)} KB)`);
