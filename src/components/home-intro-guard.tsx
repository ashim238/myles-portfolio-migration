import { HOME_BROWSER_INTRO_KEY, HOME_ENTRANCE_KEY } from "@/lib/home-intro";

/** Runs before React hydrates so the first paint does not flash full-opacity content. */
export function HomeIntroGuard() {
  return (
    <script
      id="home-intro-guard"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var b=sessionStorage.getItem("${HOME_BROWSER_INTRO_KEY}")==="1";var e=sessionStorage.getItem("${HOME_ENTRANCE_KEY}")==="1";var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!r&&(!b||!e))document.documentElement.classList.add("home-intro-wait");}catch(err){}})();`,
      }}
    />
  );
}
