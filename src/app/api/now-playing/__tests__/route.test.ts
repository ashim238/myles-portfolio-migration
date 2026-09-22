import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/now-playing/spotify", () => ({
  getCurrentlyPlaying: vi.fn(),
}));

import { GET } from "@/app/api/now-playing/route";
import { getCurrentlyPlaying } from "@/lib/now-playing/spotify";

describe("GET /api/now-playing", () => {
  beforeEach(() => vi.mocked(getCurrentlyPlaying).mockReset());

  it("returns a private no-store display payload", async () => {
    vi.mocked(getCurrentlyPlaying).mockResolvedValue(null);

    const response = await GET();

    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    await expect(response.json()).resolves.toEqual({ liveTrack: null });
  });
});
