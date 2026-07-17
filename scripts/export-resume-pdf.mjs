#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "google-chrome",
  "chromium",
].filter(Boolean);
const CDP_REQUEST_TIMEOUT_MS = 15_000;
const EXPORT_OPERATION_TIMEOUT_MS = 75_000;
const PDF_STREAM_CHUNK_SIZE = 256 * 1024;
const MAX_PDF_BYTES = 25 * 1024 * 1024;
const MAX_PDF_CHUNKS = 128;

function operationError() {
  return new Error(`Resume PDF export timed out after ${EXPORT_OPERATION_TIMEOUT_MS}ms.`);
}

function assertOperationActive(signal) {
  if (signal.aborted) throw operationError();
}

function requestSignal(signal, timeoutMs = CDP_REQUEST_TIMEOUT_MS) {
  return AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]);
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--url" || key === "--out") {
      options[key.slice(2)] = argv[index + 1];
      index += 1;
    }
  }
  if (!options.url || !options.out) {
    throw new Error("Usage: export-resume-pdf.mjs --url <resume-url> --out <candidate.pdf>");
  }
  return options;
}

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    const probe = spawnSync(candidate, ["--version"], { encoding: "utf8" });
    if (probe.status === 0) {
      return { path: candidate, version: probe.stdout.trim() || probe.stderr.trim() };
    }
  }
  throw new Error("Google Chrome or Chromium was not found. Set CHROME_PATH explicitly.");
}

async function findOpenPort(signal) {
  return new Promise((resolvePort, rejectPort) => {
    const server = createServer();
    const cleanup = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
    };
    const fail = (error) => {
      cleanup();
      rejectPort(error);
    };
    const onAbort = () => {
      server.close();
      fail(operationError());
    };
    const timer = setTimeout(() => {
      server.close();
      fail(new Error(`Debugging-port allocation timed out after ${CDP_REQUEST_TIMEOUT_MS}ms.`));
    }, CDP_REQUEST_TIMEOUT_MS);
    signal.addEventListener("abort", onAbort, { once: true });
    server.once("error", fail);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        cleanup();
        if (address && typeof address !== "string") resolvePort(address.port);
        else rejectPort(new Error("Could not allocate a Chrome debugging port."));
      });
    });
  });
}

async function waitForPage(port, signal, timeoutMs = 15_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    assertOperationActive(signal);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`, {
        signal: requestSignal(signal),
      });
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page");
      if (page?.webSocketDebuggerUrl) return page;
    } catch {
      assertOperationActive(signal);
      // Chrome may have written its port before the target endpoint is ready.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 80));
  }
  throw new Error("Timed out waiting for a Chrome page target.");
}

class CdpClient {
  constructor(url, signal) {
    this.socket = new WebSocket(url);
    this.signal = signal;
    this.nextId = 1;
    this.pending = new Map();
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      clearTimeout(pending.timer);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }

  async open() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolveOpen, rejectOpen) => {
      const cleanup = () => {
        clearTimeout(timer);
        this.signal.removeEventListener("abort", onAbort);
      };
      const onOpen = () => {
        cleanup();
        resolveOpen();
      };
      const onError = () => {
        cleanup();
        rejectOpen(new Error("WebSocket failed to open."));
      };
      const onAbort = () => {
        cleanup();
        rejectOpen(operationError());
      };
      const timer = setTimeout(() => {
        cleanup();
        rejectOpen(new Error(`WebSocket open timed out after ${CDP_REQUEST_TIMEOUT_MS}ms.`));
      }, CDP_REQUEST_TIMEOUT_MS);
      this.socket.addEventListener("open", onOpen, { once: true });
      this.socket.addEventListener("error", onError, { once: true });
      this.signal.addEventListener("abort", onAbort, { once: true });
    });
  }

  send(method, params = {}, timeoutMs = CDP_REQUEST_TIMEOUT_MS) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolveMessage, rejectMessage) => {
      assertOperationActive(this.signal);
      const onAbort = () => {
        clearTimeout(timer);
        this.pending.delete(id);
        rejectMessage(operationError());
      };
      const timer = setTimeout(() => {
        this.signal.removeEventListener("abort", onAbort);
        this.pending.delete(id);
        rejectMessage(new Error(`${method} timed out after ${timeoutMs}ms.`));
      }, timeoutMs);
      this.pending.set(id, {
        resolve: (result) => {
          this.signal.removeEventListener("abort", onAbort);
          resolveMessage(result);
        },
        reject: (error) => {
          this.signal.removeEventListener("abort", onAbort);
          rejectMessage(error);
        },
        timer,
      });
      this.signal.addEventListener("abort", onAbort, { once: true });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

export async function readPdfStream(
  client,
  handle,
  signal,
  { maxBytes = MAX_PDF_BYTES, maxChunks = MAX_PDF_CHUNKS } = {},
) {
  const chunks = [];
  let byteCount = 0;
  let chunkCount = 0;
  try {
    while (true) {
      assertOperationActive(signal);
      if (chunkCount >= maxChunks) {
        throw new Error(`PDF stream exceeded the ${maxChunks}-chunk limit.`);
      }
      const chunk = await client.send("IO.read", {
        handle,
        size: PDF_STREAM_CHUNK_SIZE,
      });
      chunkCount += 1;
      if (chunk.data) {
        const bytes = Buffer.from(chunk.data, chunk.base64Encoded ? "base64" : "utf8");
        byteCount += bytes.length;
        if (byteCount > maxBytes) {
          throw new Error(`PDF stream exceeded the ${maxBytes}-byte limit.`);
        }
        chunks.push(bytes);
      }
      if (chunk.eof) break;
    }
  } finally {
    try {
      await client.send("IO.close", { handle });
    } catch {
      // Preserve the original stream-limit or operation-timeout error.
    }
  }
  return Buffer.concat(chunks);
}

async function assertPrintCapabilities(port, signal) {
  const response = await fetch(`http://127.0.0.1:${port}/json/protocol`, {
    signal: requestSignal(signal),
  });
  if (!response.ok) {
    throw new Error(`Could not read Chrome's DevTools protocol schema (${response.status}).`);
  }
  const schema = await response.json();
  const page = schema.domains.find((domain) => domain.domain === "Page");
  const printToPDF = page?.commands?.find((command) => command.name === "printToPDF");
  const parameters = new Set(printToPDF?.parameters?.map((parameter) => parameter.name));
  for (const required of ["generateTaggedPDF", "generateDocumentOutline"]) {
    if (!parameters.has(required)) {
      throw new Error(`Chrome Page.printToPDF does not expose ${required}.`);
    }
  }
}

async function waitForDocumentReady(client, expectedUrl, signal, timeoutMs = 15_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    assertOperationActive(signal);
    try {
      const evaluation = await client.send("Runtime.evaluate", {
        expression: "({ href: location.href, readyState: document.readyState })",
        returnByValue: true,
      });
      const state = evaluation.result?.value;
      if (state?.href === expectedUrl && state.readyState === "complete") return;
    } catch {
      assertOperationActive(signal);
      // A navigation can replace the JavaScript execution context between polls.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 80));
  }
  throw new Error(`Timed out waiting for ${expectedUrl} to finish loading.`);
}

async function exportResume({ url, out }, signal) {
  assertOperationActive(signal);
  const output = resolve(out);
  const publicDirectory = resolve("public");
  if (output === publicDirectory || output.startsWith(`${publicDirectory}/`)) {
    throw new Error("Candidate export refused: --out must not point inside public/.");
  }

  const chrome = findChrome();
  const profile = await mkdtemp(resolve(tmpdir(), "resume-pdf-chrome-"));
  const port = await findOpenPort(signal);
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-sync",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-address=127.0.0.1",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ];
  const processHandle = spawn(chrome.path, args, { stdio: "ignore" });
  let client;

  try {
    console.error("[resume-pdf] waiting for Chrome target");
    await waitForPage(port, signal);
    console.error("[resume-pdf] checking tagged-PDF capabilities");
    await assertPrintCapabilities(port, signal);
    const target = await waitForPage(port, signal);
    client = new CdpClient(target.webSocketDebuggerUrl, signal);
    await client.open();
    console.error("[resume-pdf] enabling page and runtime domains");
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    console.error("[resume-pdf] applying print media emulation");
    await client.send("Emulation.setEmulatedMedia", {
      media: "print",
      features: [
        { name: "prefers-color-scheme", value: "light" },
        { name: "prefers-reduced-motion", value: "reduce" },
      ],
    });
    console.error("[resume-pdf] navigating to résumé");
    await client.send("Page.navigate", { url });
    await waitForDocumentReady(client, url, signal);
    console.error("[resume-pdf] waiting for document fonts");
    await client.send("Runtime.evaluate", {
      expression: "document.fonts.ready.then(() => new Promise(requestAnimationFrame))",
      awaitPromise: true,
      returnByValue: true,
    });
    console.error("[resume-pdf] applying light theme");
    await client.send("Runtime.evaluate", {
      expression: 'document.documentElement.dataset.theme = "light"',
      returnByValue: true,
    });
    console.error("[resume-pdf] requesting tagged PDF");
    const result = await client.send(
      "Page.printToPDF",
      {
        landscape: false,
        displayHeaderFooter: false,
        printBackground: true,
        preferCSSPageSize: true,
        generateTaggedPDF: true,
        generateDocumentOutline: true,
        transferMode: "ReturnAsStream",
      },
      30_000,
    );
    console.error("[resume-pdf] received tagged PDF payload");
    if (!result.stream) throw new Error("Chrome returned no PDF stream handle.");
    const pdf = await readPdfStream(client, result.stream, signal);
    if (pdf.length === 0) throw new Error("Chrome returned an empty PDF stream.");

    await mkdir(dirname(output), { recursive: true });
    const temporaryOutput = `${output}.tmp`;
    await writeFile(temporaryOutput, pdf);
    await rename(temporaryOutput, output);
    console.log(`${chrome.version}\nWrote tagged candidate PDF to ${output}`);
  } finally {
    if (client) {
      try {
        await client.send("Browser.close");
      } catch {
        processHandle.kill("SIGTERM");
      }
      client.close();
    } else {
      processHandle.kill("SIGTERM");
    }
    await rm(profile, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await exportResume(
      parseArgs(process.argv.slice(2)),
      AbortSignal.timeout(EXPORT_OPERATION_TIMEOUT_MS),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
