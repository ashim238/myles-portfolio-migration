import type { ProjectChapterEvidence } from "@/lib/project-evidence/types";

export const UNDERSTANDING_FAFSA_EVIDENCE = [
  {
    chapterId: "uf-context",
    dominantClaim: {
      id: "uf-context-old-template",
      text: "The old email system made deadline guidance harder to scan and was poorly aligned with mobile use and the new brand.",
      class: "descriptive",
      state: "observed",
    },
    interpretation:
      "The redesign needed to improve scanning and mobile structure while fitting an email-only scope and a founder-operated workflow.",
    caveat:
      "The comparison is an expert content and interface audit, not a controlled student comprehension study.",
    proofs: [
      {
        id: "uf-before-after-phones",
        label: "Old and redesigned mobile newsletters",
        kind: "comparison",
        role: "dominant",
        surface: "BeforeAfterPhones",
        surfaceChapterId: "uf-context",
        job: "Make the hierarchy, CTA, section-break, mobile, and palette differences visible.",
        proves:
          "The old and new systems differ materially in scanning cues, structure, and mobile presentation.",
        limitation:
          "The visual comparison does not measure comprehension or task success.",
      },
    ],
  },
  {
    chapterId: "uf-audit",
    dominantClaim: {
      id: "uf-audit-rules",
      text: "The 120-plus newsletter audit produced explicit rules for hierarchy, structure, tone, and send types.",
      class: "interpretive",
      state: "observed",
    },
    interpretation:
      "The audit became a traceable set of system decisions instead of a mood board of preferred examples.",
    caveat:
      "The benchmark audit compares existing newsletters and does not replace direct research with students, parents, counselors, or the founder.",
    proofs: [
      {
        id: "uf-audit-rule-list",
        label: "Audit finding to system-rule chain",
        kind: "structured",
        role: "dominant",
        surface: "UNDERSTANDING_FAFSA_AUDIT_RULES",
        surfaceChapterId: "uf-audit",
        job: "Pair every audited weakness with a concrete system response.",
        proves:
          "The newsletter rules are explicitly tied to findings about scanning, changing content, founder assembly, clipping, and send density.",
        limitation:
          "The rules reflect comparative analysis and implementation judgment, not experimental validation.",
      },
    ],
  },
  {
    chapterId: "uf-locked",
    dominantClaim: {
      id: "uf-locked-modular-workflow",
      text: "A locked-versus-swappable template system lets the founder assemble multiple send types without changing structure or editing HTML.",
      class: "behavioral",
      state: "built",
    },
    interpretation:
      "Fixed order, spacing, type, and dividers protect consistency while weekly copy and imagery remain editable.",
    caveat:
      "The counselor toolkit remains in progress, and the case study does not claim measured time savings.",
    proofs: [
      {
        id: "uf-composer-demo",
        label: "Newsletter composer demonstration",
        kind: "interactive",
        role: "dominant",
        surface: "NewsletterComposerDemo",
        surfaceChapterId: "uf-locked",
        job: "Demonstrate how a send can be assembled from reusable content blocks.",
        proves:
          "The system supports repeatable assembly without editing raw HTML.",
        limitation:
          "The demonstration does not quantify the founder's time, error rate, or long-term maintenance cost.",
      },
      {
        id: "uf-locked-swappable-view",
        label: "Locked and swappable system rules",
        kind: "structured",
        role: "supporting",
        surface: "LockedSwappableView",
        surfaceChapterId: "uf-locked",
        job: "Clarify which parts of the system remain fixed and which change by send.",
        proves:
          "The design has explicit boundaries between brand structure and weekly content.",
        limitation:
          "The view documents the rule set but does not show how consistently it will be followed over time.",
      },
      {
        id: "uf-template-switcher",
        label: "Three newsletter send types",
        kind: "interactive",
        role: "supporting",
        surface: "TemplateSwitcher",
        surfaceChapterId: "uf-locked",
        job: "Show how welcome, weekly, and event sends vary inside one system.",
        proves:
          "The system supports multiple content densities and purposes with shared rules.",
        limitation:
          "The three variants do not establish that every future send type is covered.",
      },
    ],
  },
  {
    chapterId: "uf-figma",
    dominantClaim: {
      id: "uf-figma-mailchimp-constraints",
      text: "The Mailchimp rebuild preserved the design intent while meeting Gmail clipping, builder, and dark-mode constraints.",
      class: "behavioral",
      state: "shipped",
    },
    interpretation:
      "Flattened structure, fewer wrappers, native blocks, and separate image optimization made the authored system workable inside production email constraints.",
    caveat:
      "Image compression reduces download weight but does not reduce the HTML source Gmail measures against its clipping threshold.",
    proofs: [
      {
        id: "uf-figma-mailchimp-pair",
        label: "Figma and Mailchimp implementation comparison",
        kind: "comparison",
        role: "dominant",
        surface: "FigmaMailchimpPair",
        surfaceChapterId: "uf-figma",
        job: "Show the design intent and the production implementation side by side.",
        proves:
          "The live Mailchimp system retains the core hierarchy and brand language after production simplification.",
        limitation:
          "The comparison cannot show deliverability across every client or future content combination.",
      },
    ],
  },
  {
    chapterId: "uf-results",
    dominantClaim: {
      id: "uf-results-shipped-observation",
      text: "The modular system shipped, and the first redesigned send had an observed 52.6% open rate with Mailchimp Privacy Protection excluded.",
      class: "outcome",
      state: "observed",
    },
    interpretation:
      "The shipped system and the observed metric can be presented together as implementation outcome and supporting context.",
    caveat:
      "The send was not a controlled attribution test, so the redesign cannot be claimed as the cause of the open-rate change.",
    proofs: [
      {
        id: "uf-open-rate-observation",
        label: "First redesigned send open-rate observation",
        kind: "metric",
        role: "dominant",
        surface: "CountUp(~52.6%)",
        surfaceChapterId: "uf-results",
        job: "Report the observed result with its date, comparison range, and attribution boundary.",
        proves:
          "Mailchimp reported about 52.6 percent with MPP excluded for the November 4, 2025 send, compared with earlier sends around 30 percent.",
        limitation:
          "The observation does not isolate the redesign from subject line, audience, timing, content, or other variables.",
      },
    ],
  },
] as const satisfies readonly ProjectChapterEvidence[];
