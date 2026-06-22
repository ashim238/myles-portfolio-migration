import { afterEach, describe, expect, it } from "vitest";
import { lockBackground, unlockBackground } from "@/lib/navi/overlay-lock";

// Defensive reset so a leaked lock from one test can't mask a bug in the next.
afterEach(() => {
  document.body.style.overflow = "";
  document.querySelector(".nv-ui")?.removeAttribute("inert");
});

describe("overlay-lock", () => {
  it("freezes body scroll on the first lock and restores it on the last unlock", () => {
    document.body.style.overflow = "scroll";
    lockBackground();
    expect(document.body.style.overflow).toBe("hidden");
    unlockBackground();
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("stays locked until the last of nested overlays unlocks", () => {
    // The mobile flow nests a date modal on top of the booking sheet. The modal
    // closing must not unfreeze scroll while the sheet underneath is still open.
    document.body.style.overflow = "auto";
    lockBackground(); // sheet opens
    lockBackground(); // modal opens on top
    unlockBackground(); // modal closes
    expect(document.body.style.overflow).toBe("hidden");
    unlockBackground(); // sheet closes
    expect(document.body.style.overflow).toBe("auto");
  });

  it("marks the minisite shell inert while any overlay is open", () => {
    const shell = document.createElement("div");
    shell.className = "nv-ui";
    document.body.appendChild(shell);
    lockBackground();
    expect(shell.hasAttribute("inert")).toBe(true);
    unlockBackground();
    expect(shell.hasAttribute("inert")).toBe(false);
    shell.remove();
  });
});
