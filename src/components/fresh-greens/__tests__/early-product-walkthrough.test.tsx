// @vitest-environment-options {"url":"http://127.0.0.1:4391/work/fresh-greens"}
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EarlyProductWalkthrough } from "../early-product-walkthrough";

const frameName = "Fresh Greens running on an iPhone simulator";
const fallbackHeading = "Compare two routes";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Fresh Greens iOS embed", () => {
  it("offers the captured route comparison without contacting a simulator when none is configured", () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(<EarlyProductWalkthrough session={null} />);
    expect(screen.getByRole("heading", { name: fallbackHeading })).toBeVisible();
    expect(screen.getByRole("button", { name: /next route/i })).toBeEnabled();
    expect(screen.queryByTitle(frameName)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open the iOS app" })).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("starts the configured hosted build on request and releases its frame when the visitor leaves", async () => {
    const user = userEvent.setup();
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(<EarlyProductWalkthrough session={{ kind: "hosted", buildId: "demo-Build_9" }} />);
    expect(screen.queryByTitle(frameName)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open the iOS app" }));
    const url = new URL(screen.getByTitle(frameName).getAttribute("src")!);
    expect(url.origin).toBe("https://appetize.io");
    expect(url.pathname).toBe("/embed/demo-Build_9");
    expect(url.searchParams.get("location")).toBe("40.6708,-73.9305");
    await user.click(screen.getByRole("button", { name: "Close simulator" }));
    expect(screen.queryByTitle(frameName)).not.toBeInTheDocument();

    expect(fetch).not.toHaveBeenCalled();
  });

  it("probes the local simulator and recovers through Retry when it becomes ready", async () => {
    const user = userEvent.setup();
    const fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ready: false }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ready: true }) });
    vi.stubGlobal("fetch", fetch);
    render(<EarlyProductWalkthrough session={{ kind: "local" }} />);
    expect(fetch).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Open the iOS app" }));
    expect(await screen.findByText(/simulator is unavailable/i)).toBeVisible();
    expect(screen.queryByTitle(frameName)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Retry simulator" }));
    expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:4397/health",
      expect.objectContaining({ credentials: "omit", cache: "no-store", signal: expect.any(AbortSignal) }));
    expect(screen.getByTitle(frameName)).toHaveAttribute("src", "http://127.0.0.1:4397/");
  });

  it("returns to the captured routes if the running native session disconnects", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ready: true }) }));
    render(<EarlyProductWalkthrough session={{ kind: "local" }} />);
    await user.click(screen.getByRole("button", { name: "Open the iOS app" }));
    const frame = await screen.findByTitle<HTMLIFrameElement>(frameName);
    act(() => { window.dispatchEvent(new MessageEvent("message", {
      origin: "http://127.0.0.1:4397",
      source: frame.contentWindow,
      data: { type: "fresh-greens-unavailable" },
    })); });
    expect(screen.getByRole("heading", { name: fallbackHeading })).toBeVisible();
    expect(screen.queryByTitle(frameName)).not.toBeInTheDocument();
  });

  it("keeps both captured routes available after a failed connection", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Could not connect")));
    render(<EarlyProductWalkthrough session={{ kind: "local" }} />);
    await user.click(screen.getByRole("button", { name: "Open the iOS app" }));
    expect(await screen.findByText(/simulator is unavailable/i)).toBeVisible();
    await user.click(screen.getByRole("button", { name: /next route/i }));
    expect(screen.getByRole("button", { name: /previous route/i })).toBeEnabled();
    expect(screen.queryByTitle(frameName)).not.toBeInTheDocument();
  });
});
