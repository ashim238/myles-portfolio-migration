import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useReducer } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SecondaryProgram } from "@/components/myles-97/secondary-programs";
import { WorkstationDesktop } from "@/components/myles-97/workstation-desktop";
import { playEntries } from "@/lib/content";
import type { ProgramDefinition } from "@/lib/myles-97/programs";
import {
  createInitialWorkstationState,
  workstationReducer,
} from "@/lib/myles-97/state";

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    priority,
    preload,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
    preload?: boolean;
  }) => {
    void priority;
    void preload;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} />;
  },
}));

const programs: ProgramDefinition[] = [
  {
    id: "fresh-greens",
    appName: "Fresh Greens.exe",
    applicationType: "Route-planning software",
    primaryEvidence: "built",
    title: "Fresh Greens",
    summary: "Fresh Greens summary",
    href: "/work/fresh-greens",
    coverImage: "/projects/fresh-greens/cover.png",
  },
  {
    id: "understandingfafsa",
    appName: "FAFSA Mail.app",
    applicationType: "Modular mail composer",
    primaryEvidence: "observed",
    title: "UnderstandingFAFSA",
    summary: "UnderstandingFAFSA summary",
    href: "/work/understandingfafsa",
    coverImage: "/projects/understandingfafsa/cover.png",
  },
  {
    id: "navi",
    appName: "Navi Places.exe",
    applicationType: "Place-discovery application",
    primaryEvidence: "built",
    title: "Navi",
    summary: "Navi summary",
    href: "/work/navi",
    coverImage: "/projects/navi/cover.png",
  },
  {
    id: "tiktok",
    appName: "TikTok Catalog.studio",
    applicationType: "Catalog-template studio",
    primaryEvidence: "shipped",
    title: "TikTok DSA",
    summary: "TikTok summary",
    href: "/work/tiktok",
    coverImage: "/projects/tiktok/cover.png",
  },
];

const looseParts = playEntries.map(({ slug, title, medium, state }) => ({
  slug,
  title,
  medium,
  state,
}));

function DesktopHarness() {
  const [state, dispatch] = useReducer(
    workstationReducer,
    undefined,
    createInitialWorkstationState,
  );
  return (
    <WorkstationDesktop
      programs={programs}
      looseParts={looseParts}
      state={state}
      dispatch={dispatch}
    />
  );
}

describe("Myles 98 secondary programs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("places the recipe note after primary work and returns focus after closing it", async () => {
    const user = userEvent.setup();
    render(<DesktopHarness />);

    const selectedWork = screen.getByRole("region", { name: "Selected Work" });
    const recipeTrigger = screen.getByRole("button", {
      name: /Open recipe note: Buss Up Shut Paratha Roti/,
    });

    expect(
      selectedWork.compareDocumentPosition(recipeTrigger) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    await user.click(recipeTrigger);
    const recipeWindow = screen.getByRole("region", { name: "Buss Up Shut.txt" });
    expect(within(recipeWindow).getByRole("heading", { name: "Ingredients" })).toBeInTheDocument();
    expect(within(recipeWindow).getByRole("heading", { name: "Method" })).toBeInTheDocument();
    expect(
      within(recipeWindow).getByRole("link", { name: /Immaculate Bites/ }),
    ).toHaveAttribute("href", "https://www.africanbites.com/paratha-buss-shut/");
    expect(recipeWindow).toHaveTextContent("Don't skip the rests!");
    expect(recipeWindow).not.toHaveTextContent(
      "The two rests are the part I would not skip.",
    );

    await user.click(
      within(recipeWindow).getByRole("button", { name: "Close Buss Up Shut.txt" }),
    );
    expect(recipeTrigger).toHaveFocus();
  });

  it("keeps Reminders as a personal desktop note list beside the recipe note", async () => {
    const user = userEvent.setup();
    render(<DesktopHarness />);

    const selectedWork = screen.getByRole("region", { name: "Selected Work" });
    const reminderTrigger = screen.getByRole("button", {
      name: "Open Reminders",
    });
    const recipeTrigger = screen.getByRole("button", {
      name: /Open recipe note: Buss Up Shut Paratha Roti/,
    });

    expect(
      selectedWork.compareDocumentPosition(reminderTrigger) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      reminderTrigger.compareDocumentPosition(recipeTrigger) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    await user.click(reminderTrigger);
    const reminderWindow = screen.getByRole("region", { name: "Reminders" });

    expect(
      within(reminderWindow).getByRole("heading", {
        name: "A couple of notes",
      }),
    ).toBeInTheDocument();
    const firstReminder = within(reminderWindow).getByRole("checkbox", {
      name: "catch up on house of the dragon",
    });
    expect(firstReminder).toHaveFocus();
    expect(
      within(reminderWindow).getByRole("checkbox", {
        name: "touch up portfolio",
      }),
    ).toBeInTheDocument();
    expect(
      within(reminderWindow).getByRole("checkbox", {
        name: "meal prep for the week",
      }),
    ).toBeInTheDocument();
    expect(within(reminderWindow).getAllByRole("checkbox")).toHaveLength(3);
    expect(reminderWindow).not.toHaveTextContent(/World’s Finest|next hike/i);
    expect(within(reminderWindow).queryAllByRole("link")).toHaveLength(0);
    expect(reminderWindow).not.toHaveTextContent(
      /Fresh Greens|UnderstandingFAFSA|Navi|TikTok/,
    );

    await user.click(firstReminder);
    expect(firstReminder).toBeChecked();

    await user.click(
      within(reminderWindow).getByRole("button", { name: "Close Reminders" }),
    );
    expect(reminderTrigger).toHaveFocus();
  });

  it("renders every existing Loose Parts entry with its canonical anchor", () => {
    render(<SecondaryProgram id="loose-parts" looseParts={looseParts} />);

    for (const entry of playEntries) {
      expect(screen.getByText(entry.title)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: `Open ${entry.title} in Loose Parts` }),
      ).toHaveAttribute("href", `/play#${entry.slug}`);
    }
  });

  it("explains an empty Loose Parts surface and recovers to Selected Work", () => {
    render(<SecondaryProgram id="loose-parts" looseParts={[]} />);

    expect(screen.getByText("No experiments are in the lab right now.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to Selected Work" })).toHaveAttribute(
      "href",
      "/#selected-work",
    );
  });

  it("keeps About and resume previews linked to their canonical routes", () => {
    const { rerender } = render(
      <SecondaryProgram id="about" looseParts={looseParts} />,
    );
    expect(screen.getByRole("link", { name: "Open full About page" })).toHaveAttribute(
      "href",
      "/about",
    );

    rerender(<SecondaryProgram id="resume" looseParts={looseParts} />);
    expect(screen.getByRole("link", { name: "Open full résumé" })).toHaveAttribute(
      "href",
      "/resume",
    );
  });

  it("opens secondary destinations as workstation programs from desktop shortcuts", async () => {
    const user = userEvent.setup();
    render(<DesktopHarness />);

    await user.click(screen.getByRole("button", { name: "Loose Parts" }));
    expect(screen.getByRole("region", { name: "Loose Parts" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "About Myles" }));
    expect(screen.getByRole("region", { name: "About Myles" })).toBeInTheDocument();
  });
});
