export type UnderstandingFafsaAuditRuleId =
  | "scanning"
  | "brand-structure"
  | "founder-workflow"
  | "gmail-clipping"
  | "send-density";

export type UnderstandingFafsaAuditRule = {
  id: UnderstandingFafsaAuditRuleId;
  finding: string;
  response: string;
};

export const UNDERSTANDING_FAFSA_AUDIT_RULES = [
  {
    id: "scanning",
    finding: "Long sends needed stronger scanning cues",
    response:
      "Action-focused section titles, selective emphasis, and clearer breaks",
  },
  {
    id: "brand-structure",
    finding: "Weekly content changed while the brand structure should not",
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
] as const satisfies readonly UnderstandingFafsaAuditRule[];

export const UNDERSTANDING_FAFSA_AUDIT_ACTIONS = {
  scanning:
    "I gave longer sends clearer breaks and more direct section titles to make them easier to scan.",
  "brand-structure":
    "I locked spacing, type hierarchy, and dividers while leaving content and module order swappable.",
  "founder-workflow":
    "I built the kit in Mailchimp so the founder could assemble each issue without touching HTML.",
  "gmail-clipping":
    "I flattened the hierarchy and cut extra wrappers once practice sends exposed Gmail clipping.",
  "send-density":
    "I made welcome, weekly, and shorter event templates so different sends could hold different amounts of content.",
} as const satisfies Record<UnderstandingFafsaAuditRuleId, string>;
