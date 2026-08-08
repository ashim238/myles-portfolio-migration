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
      id: "uf-audit-brief",
      text: "A review of more than 120 newsletters became one brief: improve scanning, lock the brand structure, and make weekly assembly work inside Mailchimp.",
      class: "interpretive",
      state: "observed",
    },
    interpretation:
      "The audit is presented as a problem, opportunity, and goal instead of a five-rule inventory.",
    caveat:
      "The benchmark review does not replace direct research with students, parents, counselors, or the founder.",
    proofs: [
      {
        id: "uf-story-brief",
        label: "Problem, opportunity, and goal brief",
        kind: "structured",
        role: "dominant",
        surface: ".uf-story-brief",
        surfaceChapterId: "uf-audit",
        job: "Condense the audit into the three decisions a hiring reader needs to retain.",
        proves:
          "The newsletter redesign responds to scanning, changing weekly content, founder assembly, and Gmail clipping constraints.",
        limitation:
          "The brief reflects comparative analysis and implementation judgment rather than experimental validation.",
      },
    ],
  },
  {
    chapterId: "uf-locked",
    dominantClaim: {
      id: "uf-locked-modular-workflow",
      text: "A locked-versus-swappable system lets the founder assemble welcome, weekly, and event sends without changing the structure or editing HTML.",
      class: "behavioral",
      state: "built",
    },
    interpretation:
      "Fixed header, footer, order, spacing, type, and dividers protect consistency while stories, links, and imagery remain editable.",
    caveat:
      "The case study does not claim measured time savings, error reduction, or coverage of every future send type.",
    proofs: [
      {
        id: "uf-composer-demo",
        label: "Newsletter composer demonstration",
        kind: "interactive",
        role: "dominant",
        surface: "NewsletterComposerDemo",
        surfaceChapterId: "uf-locked",
        job: "Demonstrate the locked header and footer alongside swappable, reorderable newsletter modules.",
        proves:
          "The authored system supports repeatable assembly without editing raw HTML.",
        limitation:
          "The reconstruction does not quantify the founder's time, error rate, or long-term maintenance cost.",
      },
    ],
  },
  {
    chapterId: "uf-figma",
    dominantClaim: {
      id: "uf-figma-mailchimp-constraints",
      text: "The Mailchimp rebuild preserved the hierarchy and brand language while meeting Gmail's clipping constraint.",
      class: "behavioral",
      state: "shipped",
    },
    interpretation:
      "A flatter hierarchy, fewer wrappers, and native blocks made the Figma proposal workable inside production email constraints.",
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
      "The shipped system and observed metric can be presented together as implementation outcome and supporting context.",
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
