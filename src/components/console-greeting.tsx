"use client";

import { useEffect } from "react";

export function ConsoleGreeting() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    console.log(
      "%cHey, you're inspecting. I like that.",
      "font-size:14px;font-weight:600;color:#8ab4ff;",
    );
    console.log(
      "%cThis portfolio is built with Next.js, React 19, and Tailwind v4.\nThe motion layer uses CSS scroll-driven animations and anime.js.\nIf you want to talk about how any of it works: ashim238@newschool.edu",
      "font-size:12px;color:#c4c4c4;",
    );
  }, []);

  return null;
}
