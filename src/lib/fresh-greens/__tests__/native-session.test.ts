import { describe, expect, it } from "vitest";
import { freshGreensSession } from "../native-session";

describe("Fresh Greens simulator configuration", () => {
  it("uses only an explicit build ID or a local opt-in", () => {
    expect(freshGreensSession({ NODE_ENV: "test" })).toBeNull();
    expect(freshGreensSession({ NODE_ENV: "test", FRESH_GREENS_APPETIZE_BUILD_ID: "https://example.org/embed/123" })).toBeNull();
    expect(freshGreensSession({ NODE_ENV: "production", FRESH_GREENS_LOCAL_SIMULATOR: "1" })).toEqual({ kind: "local" });
    expect(freshGreensSession({ NODE_ENV: "production", FRESH_GREENS_LOCAL_SIMULATOR: "1", VERCEL: "1" })).toBeNull();
  });

  it("uses the hosted build when both options are configured", () => {
    expect(freshGreensSession({
      NODE_ENV: "production",
      FRESH_GREENS_APPETIZE_BUILD_ID: "  demo-Build_9  ",
      FRESH_GREENS_LOCAL_SIMULATOR: "1",
    })).toEqual({ kind: "hosted", buildId: "demo-Build_9" });
  });
});
