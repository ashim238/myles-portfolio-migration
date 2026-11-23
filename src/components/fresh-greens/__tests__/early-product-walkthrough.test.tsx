// @vitest-environment-options {"url":"http://127.0.0.1:4391/work/fresh-greens"}
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EarlyProductWalkthrough } from "../early-product-walkthrough";

const frameName = "Fresh Greens running on an iPhone simulator";
const recordingName = "Recorded Weeksville drive in the Fresh Greens iOS app";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Fresh Greens iOS embed", () => {
  it("offers the genuine recording when a simulator is not configured", () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(<EarlyProductWalkthrough session={null} />);
    const video = screen.getByLabelText(recordingName);
    expect(video).toHaveAttribute("src", "/projects/fresh-greens/daylight-key/weeksville-drive.mp4");
    expect(video).toHaveAttribute("controls");
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
    await user.click(screen.getByRole("button", { name: "Watch a recorded drive" }));
    expect(screen.getByLabelText(recordingName)).toBeVisible();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("releases the hosted frame when the simulator disclosure is closed", async () => {
    const user = userEvent.setup();
    render(
      <details open>
        <summary>Open the native iOS simulator</summary>
        <EarlyProductWalkthrough session={{ kind: "hosted", buildId: "demo" }} />
      </details>,
    );
    await user.click(screen.getByRole("button", { name: "Open the iOS app" }));
    expect(screen.getByTitle(frameName)).toBeInTheDocument();
    await user.click(screen.getByText("Open the native iOS simulator"));
    await waitFor(() => expect(screen.queryByTitle(frameName)).not.toBeInTheDocument());
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
    expect(screen.getByRole("status")).toHaveTextContent(/simulator is unavailable/i);
    expect(screen.queryByTitle(frameName)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Retry simulator" }));
    expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:4397/health",
      expect.objectContaining({ credentials: "omit", cache: "no-store", signal: expect.any(AbortSignal) }));
    expect(screen.getByTitle(frameName)).toHaveAttribute("src", "http://127.0.0.1:4397/");
  });

  it("keeps the recording available after a failed connection", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Could not connect")));
    render(<EarlyProductWalkthrough session={{ kind: "local" }} />);
    await user.click(screen.getByRole("button", { name: "Open the iOS app" }));
    expect(screen.getByRole("status")).toHaveTextContent(/simulator is unavailable/i);
    await user.click(screen.getByRole("button", { name: "Watch a recorded drive" }));
    expect(screen.getByLabelText(recordingName)).toBeVisible();
  });
});
