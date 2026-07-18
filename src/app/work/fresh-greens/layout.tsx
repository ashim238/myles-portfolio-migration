import { Instrument_Serif } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "normal",
});

export default function FreshGreensLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={instrumentSerif.variable}
      style={
        {
          "--font-quote": "var(--font-instrument-serif)",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
