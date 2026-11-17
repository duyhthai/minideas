// Local preview that stays up: serves dist/ at http://localhost:4321, rebuilds when src/ or build.mjs changes,
// and reloads open pages after each successful build.
//
//   npm run dev        (PORT=5000 npm run dev for another port)
// /newsletter/ shows the newsletter drafts (ready-to-paste emails for the newest stacks).
// Add ?noreload to a URL to get the page without the reload hook (headless screenshots wait forever on it).
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { watch, existsSync, statSync, createReadStream } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PORT = +process.env.PORT || 4321;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json",
  ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json" };
const RELOAD = `<script>new EventSource("/__reload").onmessage = () => location.reload();</script>`;

/* ---------- rebuild on change ---------- */
const clients = new Set();
let building = false, again = false;
function build() {
  if (building) { again = true; return; }
  building = true;
  const started = Date.now();
  const child = spawn(process.execPath, ["build.mjs"], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  let out = "";
  child.stdout.on("data", d => out += d);
  child.stderr.on("data", d => out += d);
  child.on("close", code => {
    building = false;
    const time = new Date().toLocaleTimeString();
    if (code === 0) {
      console.log(`[${time}] built in ${((Date.now() - started) / 1000).toFixed(1)}s, reloading ${clients.size} page(s)`);
      for (const res of clients) res.write("data: reload\n\n");
    } else console.log(`[${time}] build failed; still serving the last good build\n${out.trim()}\n`);
    if (again) { again = false; build(); }
  });
}
let timer;
const changed = () => { clearTimeout(timer); timer = setTimeout(build, 150); };
watch(join(ROOT, "src"), { recursive: true }, changed);
// watch the folder, not the file: editors save by replacing the file, and a file watch stays on the old copy
watch(ROOT, (_, name) => { if (name === "build.mjs") changed(); });

/* ---------- static server ---------- */
createServer((req, res) => {
  const url = new URL(req.url, "http://x"), path = decodeURIComponent(url.pathname);
  if (path === "/__reload") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write(": connected\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  let file = normalize(join(DIST, path));
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  // newsletter drafts: written by the build outside dist/, so they're never deployed
  if (/^\/newsletter\/?$/.test(path)) file = join(ROOT, "node_modules/.cache/newsletter.html");
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  // a missing address gets dist/404.html, as the host serves it
  let status = 200;
  if (!existsSync(file)) { status = 404; file = join(DIST, "404.html"); }
  if (!existsSync(file)) { res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found"); return; }
  const type = TYPES[extname(file)] || "application/octet-stream";
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  if (type.startsWith("text/html") && !url.searchParams.has("noreload")) {
    // add the reload hook to every page (only here, never in dist/); ?noreload skips it for screenshots
    let html = "";
    createReadStream(file, "utf8").on("data", d => html += d).on("end", () => res.end(html.replace("</body>", `${RELOAD}</body>`)));
  } else createReadStream(file).pipe(res);
}).on("error", e => {
  console.error(e.code === "EADDRINUSE" ? `Port ${PORT} is already in use. Stop the other server, or run PORT=5000 npm run dev.` : e.message);
  process.exit(1);
}).listen(PORT, () => {
  console.log(`Minideas: http://localhost:${PORT}  (watching src/ and build.mjs; Ctrl+C to stop)`);
  build();
});
