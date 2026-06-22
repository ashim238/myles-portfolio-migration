import { describe, it, expect } from "vitest";
import * as ui from "@/components/navi/ui";

describe("ui barrel", () => {
  it("exports every component", () => {
    for (const name of [
      "Button", "IconButton", "Tag", "Label", "ImpactSignal", "Rating",
      "Avatar", "Tabs", "Accordion", "Tooltip", "SearchInput",
      "CarouselArrow", "PaginationDots", "MapPin", "Card", "TabBar",
    ]) {
      expect(ui).toHaveProperty(name);
    }
  });
});
