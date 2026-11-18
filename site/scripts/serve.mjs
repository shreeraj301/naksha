/* Serves the static export in ./out on http://127.0.0.1:4401, the way a host would. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../out");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".txt": "text/plain; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".json": "application/json", ".ico": "image/x-icon", ".png": "image/png" };
const port = Number(process.env.PORT || 4401);
createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try { if ((await stat(file)).isDirectory()) file = path.join(file, "index.html"); }
  catch { file = path.join(root, "404.html"); res.statusCode = 404; }
  try { const body = await readFile(file); res.setHeader("content-type", types[path.extname(file)] || "application/octet-stream"); res.end(body); }
  catch { res.writeHead(404).end("Not found"); }
}).listen(port, "127.0.0.1", () => console.log(`Naksha site on http://127.0.0.1:${port}`));
