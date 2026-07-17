import { describe, expect, it } from "vitest";
import { readPdfStream } from "../../../../scripts/export-resume-pdf.mjs";

describe("resume PDF streamed export limits", () => {
  it("rejects a stream that exceeds its byte cap and still closes the handle", async () => {
    const calls: string[] = [];
    const client = {
      async send(method: string) {
        calls.push(method);
        if (method === "IO.read") {
          return { data: Buffer.from("four").toString("base64"), base64Encoded: true, eof: true };
        }
        return {};
      },
    };

    await expect(
      readPdfStream(client, "fixture", new AbortController().signal, { maxBytes: 3 }),
    ).rejects.toThrow("byte limit");
    expect(calls).toEqual(["IO.read", "IO.close"]);
  });

  it("rejects a stream that exceeds its chunk cap and still closes the handle", async () => {
    const calls: string[] = [];
    const client = {
      async send(method: string) {
        calls.push(method);
        if (method === "IO.read") return { data: "", eof: false };
        return {};
      },
    };

    await expect(
      readPdfStream(client, "fixture", new AbortController().signal, { maxChunks: 2 }),
    ).rejects.toThrow("chunk limit");
    expect(calls).toEqual(["IO.read", "IO.read", "IO.close"]);
  });

  it("rejects immediately when the whole-operation deadline signal has expired", async () => {
    const controller = new AbortController();
    controller.abort();
    const client = { send: async () => ({}) };

    await expect(readPdfStream(client, "fixture", controller.signal)).rejects.toThrow(
      "export timed out",
    );
  });
});
