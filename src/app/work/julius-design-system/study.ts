import type { ExhibitItem, JuliusStudy } from "../julius-study-types";

// Sources are in the November 13 Julius Portfolio Archive. The Aug 18 design
// critique inventories the 17 components. Dated decisions on Oct 1, Oct 7,
// Oct 28 and Nov 3 cover disabled states, motion, Indigo and sidebar keylines.
// The Nov 13 design-system hub log records the dialog answer and final choice.
const asset = (name: string) => `/projects/julius-design-system/${name}`;

// The Nov 13 comparison was rendered at 1280px and 375px. Its three phone
// captures are pixel-identical. The portfolio preserves each desktop choice.
const desktopFooters: ExhibitItem[] = [
  {
    label: "Right aligned",
    src: asset("dialog-right.webp"),
    alt: "Keep reviewing and Leave sit together at the right edge. Each button fits its label.",
    caption: "Our original layout. “Keep reviewing” is a longer label than “Leave,” so its button takes up more room.",
  },
  {
    label: "Fill the row",
    src: asset("dialog-fill.webp"),
    alt: "Two equal-width buttons span the footer, with a gap between them and padding at the edges.",
    caption: "I went with this one. The buttons share the space underneath the message, and the Indigo fill draws my eye to “Leave.”",
  },
  {
    label: "Center the pair",
    src: asset("dialog-center.webp"),
    alt: "Two equal-width buttons sit in the center with space left over on both sides.",
    caption: "This was the third option we tried after the review. Here they’re the same width, with space left over on either side.",
  },
];
const phoneFooters = desktopFooters.map(({ label }) => ({
  label,
  src: asset("dialog-phone.webp"),
  alt: "On a phone, Keep reviewing and Leave each fill their own row.",
  caption: "At 375 pixels wide, the buttons stack in all three versions. “Keep reviewing” still gets a full row.",
}));

export const systemStudy: JuliusStudy = {
  slug: "julius-design-system",
  title: "Julius Design System",
  summary: "I built out the component library at Julius. By November, we’d shipped two releases and had working examples for 22 components.",
  background: "Alexis Li, our senior designer, had already brought a few components from Figma into code. I went through our shipped products to see which components we used most frequently. As I added to the library bit by bit, Alexis tried the components in a client prototype. Sometimes she’d send me a change she’d already made there, and I’d implement it back into the library.",
  role: "Myles Ashitey, product design intern. I audited the product suite, designed and coded components, and built the review and release workflow.",
  team: "Alexis Li, senior designer. She created the Figma library and coded the first components. We reviewed my additions together.",
  timeframe: "August to November 2026",
  goal: "Give the team a shared library they could use across products and a way to review changes as they built.",
  outcome: "The corporate website adopted the second release. I also built out a docs site where the team could try a component, see how it worked, and look up when to use it.",
  proof: { label: "Explore the component inventory", href: "#component-inventory" },
  cover: {
    kind: "image",
    title: "Inside the component library",
    src: asset("component-specimen.webp"),
    mobileSrc: asset("component-specimen-phone.webp"),
    alt: "A dark navigation sidebar, a region dropdown open to Southeast, and two buttons labeled Primary and Neutral.",
    caption: "I used a light Indigo background for the selected region and a solid Indigo fill to make the primary button easier to spot.",
  },
  chapters: [
    {
      id: "dialog-review",
      stage: "Design review",
      title: "A full row for the dialog buttons",
      paragraphs: [
        "A screenshot in Chromatic could show us that something had moved a few pixels. To find out what I’d changed, Alexis had to open the pull request on GitHub and read the description. We kept going back and forth because it was hard for her to tell what I wanted her eyes on.",
        "I made us a review form in Claude. Each round, I could put my question beside the component and show a few examples from other design systems. Alexis could pick an option or leave me a note if she wanted to suggest something I hadn’t included.",
        "Both buttons sat in the bottom-right corner of the desktop dialog, with a lot of empty space to their left. I expected some dialogs to have a few paragraphs of text, and I wanted your eye to land on the two choices when you finished reading. So I tried giving each button half the row.",
      ],
      exhibits: [
        {
          kind: "image", title: "The question I put up for review",
          src: asset("dialog-question.webp"), mobileSrc: asset("dialog-question-phone.webp"),
          alt: "The review question offers right alignment, a full row, or another suggestion, with a text field for a note.",
          caption: "I asked Alexis to choose an alignment or suggest another one. This excerpt keeps the question and the space she had to explain her choice.",
          link: { label: "Open the review form", href: asset("dialog-review.html") },
        },
        {
          kind: "compare", title: "Three ways to arrange the buttons",
          items: desktopFooters, phoneItems: phoneFooters,
        },
      ],
      after: [
        "Alexis liked the full row and asked me to try a centered version too. When I put all three layouts side by side, my eye went straight to “Leave” in the full-row version. That’s the one we chose for desktop.",
        "We kept Chromatic to catch unexpected visual changes. At handoff, we’d chosen the dialog layout for a future release.",
      ],
    },
    {
      id: "sidebar",
      stage: "Product integration",
      title: "Updating the shared sidebar",
      paragraphs: [
        "We were already using the sidebar in our workforce products. When Alexis tried it in a client prototype, she moved the title and copyright over to line up with the navigation icons. She also adjusted the collapse button on the right and sent me her version.",
        "The navigation rows already had the spacing we wanted. I set three vertical guides, called keylines, based on where the icons, labels, and controls sat. That way, if we changed the padding later, the title and footer would move with the navigation.",
      ],
      after: [
        "That change shipped in our November library release. I added a browser check so we’d catch it if a future update moved anything out of line.",
        "I came back to the sidebar when I worked on the accordion, too. I used the same rounded highlight when you hovered over a heading. On an open accordion, that left a little space between the highlight and the first line of text.",
      ],
    },
    {
      id: "color",
      stage: "Color",
      title: "Indigo for primary actions",
      paragraphs: [
        "I audited 17 existing components to see which colors came from the system and which had been set by hand. The sidebar used white at a few different opacities. I replaced those values with semantic tokens for subtle, default, and strong overlays on dark surfaces. That way, I could adjust the subtle overlay everywhere we used it.",
        "In Figma, the original components referred directly to swatches like Indigo or Gray. In code I could name a color for its job, like the primary action. I’d picked Slate for that role because we wanted Julius to feel more restrained. Then I saw “Request a demo” disappear into a page full of Slate. Alexis suggested Indigo, and it was much easier to pick out on Career Map.",
      ],
      exhibits: [{
        kind: "image", title: "The primary action on Career Map",
        src: asset("website-action.webp"), mobileSrc: asset("website-action-detail.webp"),
        alt: "The dark Career Map hero uses Indigo for Request a demo in the header and below the introduction.",
        caption: "I used Indigo for “Request a demo” in the header and again below the Career Map introduction.",
      }],
    },
    {
      id: "checks",
      stage: "Accessibility testing",
      title: "Making disabled controls easier to recognize",
      paragraphs: [],
      examples: [{
        text: "One of the automated checks I set up flagged the helper text under a disabled field. I darkened the text and the contrast check passed. Then I put the field next to an editable one in Storybook. I could read both, but I could barely tell which one I could type in.",
        trial: "fields",
      }, {
        text: "We’d been fading the whole button when it was disabled, so the same label could be easy to read on one background and hard to make out on another. I gave disabled buttons their own colors for light and dark surfaces, then added a check to flag the old opacity rule if it came back.",
        trial: "disabled-buttons",
      }],
    },
    {
      id: "shared-timing",
      stage: "Motion design",
      title: "Dropdown timing",
      paragraphs: [
        "We’d been setting animation speeds in individual modules. I found nine different durations in the library alone. If someone was adding a dropdown, I wanted them to be able to look up how fast it should open without having to eyeball it again.",
        "I tried the timings side by side and settled on three. A small change like an arrow turning could take 150 milliseconds, a menu opening or resizing could take 240, and a larger expansion could take 400. I documented how each movement should speed up or slow down, too.",
      ],
      after: [
        "By the time I left, the dropdown arrow already used the fast timing when it turned. I hadn’t animated the menu opening yet. The next person working on the dropdown could try the suggested timing and see the end states in the docs with reduced motion on.",
      ],
    },
    {
      id: "docs-site",
      stage: "Documentation",
      title: "Building the docs site",
      paragraphs: [
        "Toward the end of my internship, I built a docs site for the 22 components in our library. I wanted someone building a module to be able to try a component and see when I’d use it. I used the job search on the homepage to put a few of those components together.",
      ],
      after: [
        "Before I left, I tested the docs build locally with our November 13 release, the same one the corporate website used for review. I checked the finished pages for private names and links. The team had a site ready to host.",
      ],
    },
  ],
};
