// Start with: node scripts/fresh-greens-simulator/serve.mjs
// Requires a booted, dedicated Fresh-Greens-Portfolio simulator with the native
// app installed. All native input goes to that simulator's XCTest sandbox.
import { execFile, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const folder = fileURLToPath(new URL(".", import.meta.url));
const port = 4397;
const host = "127.0.0.1";
const origin = "http://" + host + ":" + port;
const parents = ["http://127.0.0.1:4391", "http://127.0.0.1:4396"];
const devices = JSON.parse((await run("xcrun", ["simctl", "list", "devices", "booted", "-j"])).stdout).devices;
const matches = Object.values(devices).flat().filter(d => d.name === "Fresh-Greens-Portfolio");
if (matches.length !== 1) throw Error("Boot one dedicated Fresh-Greens-Portfolio simulator before starting the preview.");
const device = matches[0].udid;
const container = bundle => run("xcrun", ["simctl", "get_app_container", device, bundle, "data"]);
const visitorBuild = process.argv.includes("--visitor");
await container(visitorBuild ? "com.freshgreens.portfolio" : "com.freshgreens.navigation");
const started = Date.now();
let inbox;
let busy = false;
let runner;
const resources = new Map(await Promise.all([["/", "index.html", "text/html"], ["/screen.js", "screen.js", "text/javascript"], ["/screen.css", "screen.css", "text/css"]].map(async ([url, file, type]) => [url, { data: await readFile(join(folder,file)), type }])));

async function locateDriver() {
  for (let attempt = 0; attempt < 180 && runner.exitCode === null; attempt++) {
    try {
      const path = join((await container("dev.freshgreens.portfolio.uitests.xctrunner")).stdout.trim(), "Library", "Caches", "FreshGreensPreview");
      if ((await stat(join(path, "ready"))).mtimeMs >= started - 1000) {
        inbox = path;
        console.log("Fresh Greens is ready at " + origin);
        return;
      }
    } catch { /* Xcode creates the test runner's container at launch. */ }
    await delay(500);
  }
  console.error("Fresh Greens test runner did not become ready.");
}

async function native(operation, payload = {}) {
  if (!inbox || busy) return null;
  busy = true;
  const id = randomUUID().toUpperCase();
  const response = join(inbox, id);
  try {
    const temp = join(inbox, "next.json");
    await writeFile(temp, JSON.stringify({ id, operation, ...payload }));
    await rename(temp, join(inbox, "request.json"));
    for (let i = 0; i < 320; i++) {
      try {
        const bytes = await readFile(response);
        await unlink(response);
        return bytes;
      } catch (err) { if (err.code !== "ENOENT") throw err; }
      await delay(40);
    }
    return null;
  } finally { busy = false; }
}

function validate(body) {
  if (!body || typeof body !== "object") return false;
  const { operation, text, points } = body;
  if (["return", "backspace"].includes(operation)) return true;
  if (operation === "text") return typeof text === "string" && text.length > 0 && text.length <= 120 && !/\p{Cc}/u.test(text);
  if (!["tap", "drag"].includes(operation) || !Array.isArray(points) || points.length !== (operation === "drag" ? 4 : 2)) return false;
  return points.every((p,i) => Number.isFinite(p) && p >= (i % 2 ? .052 : 0) && p <= (i % 2 ? .975 : 1));
}

const server = createServer(async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; base-uri 'none'; frame-ancestors " + parents.join(" "));
  function send(code, data = "", type = "text/plain") { res.writeHead(code, {"Content-Type":type}); res.end(data); }
  if (req.headers.host !== host + ":" + port) return send(403);
  try {
    if (req.method === "GET" && req.url === "/health") {
      if (parents.includes(req.headers.origin)) res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
      res.setHeader("Vary", "Origin");
      return send(200, JSON.stringify({ready:Boolean(inbox)}), "application/json");
    }
    const resource = resources.get(req.url);
    if (resource && req.method === "GET") return send(200, resource.data, resource.type + "; charset=utf-8");
    // Browsers inside the allowlisted iframe make same-origin requests. Other
    // pages cannot fetch pictures or issue actions against the local simulator.
    if (req.headers["sec-fetch-site"] !== "same-origin" || req.headers["x-fg-preview"] !== "1") return send(403);
    if (req.url === "/frame" && req.method === "GET") {
      if (busy) return send(409);
      const frame = await native("frame");
      return frame?.length ? send(200, frame, "image/jpeg") : send(503);
    }
    if (req.url !== "/input" || req.method !== "POST") return send(404);
    if (req.headers.origin !== origin || req.headers["content-type"] !== "application/json") return send(403);
    let body = "";
    for await (const chunk of req) {
      body += chunk;
      if (Buffer.byteLength(body) > 2048) return send(413);
    }
    let data;
    try { data = JSON.parse(body); } catch { return send(400); }
    if (!validate(data)) return send(400);
    if (busy) return send(409);
    const result = await native(data.operation, {points:data.points,text:data.text});
    return send(result?.toString() === "ok" ? 204 : 503);
  } catch { return send(503); }
});

server.listen(port, host, () => {
  console.log("Starting the dedicated Fresh Greens XCTest runner.");
  runner = spawn("xcodebuild", ["test", "-project", join(folder, "Driver.xcodeproj"), "-scheme", "Driver",
    "-destination", "id=" + device, "-derivedDataPath", join(tmpdir(), "fg-portfolio-driver"),
    "-parallel-testing-enabled", "NO", "-test-timeouts-enabled", "NO",
    ...(visitorBuild ? ["SWIFT_ACTIVE_COMPILATION_CONDITIONS=PORTFOLIO_VISITOR"] : [])], {stdio: ["ignore","ignore","inherit"]});
  runner.on("exit", () => { inbox = undefined; server.close(); });
  void locateDriver();
});
function stop() { if (runner && runner.exitCode === null) runner.kill("SIGINT"); server.close(); }
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
