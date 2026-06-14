"use client";

import { useLayoutEffect } from "react";
import { applyHomeIntroWaitClass } from "@/lib/home-intro";

/** Hides main content before intro animations on client navigations to home. */
export function HomeIntroGuard() {
  useLayoutEffect(() => {
    applyHomeIntroWaitClass();
  }, []);

  return null;
}
