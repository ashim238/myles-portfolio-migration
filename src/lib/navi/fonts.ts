import { Jost, Lato } from "next/font/google";

// Jost = display; Lato = UI/body. Exposed as CSS variables, consumed under .nv-ui.
export const naviDisplay = Jost({
  variable: "--nv-font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const naviBody = Lato({
  variable: "--nv-font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
