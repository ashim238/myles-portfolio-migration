import { describe, expect, it } from "vitest";
import { UNDERSTANDING_FAFSA_AUDIT_RULES } from "@/lib/understandingfafsa-audit-rules";

describe("UnderstandingFAFSA audit-to-rule contract", () => {
  it("keeps the five approved findings in causal order", () => {
    expect(UNDERSTANDING_FAFSA_AUDIT_RULES).toEqual([
      {
        id: "scanning",
        finding: "Long sends needed stronger scanning cues",
        response:
          "Action-focused section titles, selective emphasis, and clearer breaks",
      },
      {
        id: "brand-structure",
        finding:
          "Weekly content changed while the brand structure should not",
        response:
          "Locked spacing, type, and dividers with swappable content, copy, and module order",
      },
      {
        id: "founder-workflow",
        finding: "The founder assembled every issue",
        response:
          "A Mailchimp-native kit that can be edited without touching HTML",
      },
      {
        id: "gmail-clipping",
        finding: "Gmail clips large HTML emails",
        response:
          "Flatter hierarchy, fewer wrappers and blocks, and selective native components",
      },
      {
        id: "send-density",
        finding: "Different send purposes need different density",
        response:
          "Welcome, weekly, and short event templates built from the same rules",
      },
    ]);
  });
});
