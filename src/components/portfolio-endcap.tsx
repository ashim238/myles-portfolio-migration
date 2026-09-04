import Link from "next/link";

type PortfolioEndcapProps = {
  context: "play" | "resume";
};

export function PortfolioEndcap({ context }: PortfolioEndcapProps) {
  const secondary =
    context === "play"
      ? { href: "/resume", label: "Résumé" }
      : { href: "/play", label: "Loose Parts" };

  return (
    <nav
      className="portfolio-endcap"
      aria-label="Continue exploring"
      data-context={context}
    >
      <p className="portfolio-endcap-label">Continue</p>
      <div className="portfolio-endcap-links">
        <Link href="/#selected-work">Work Stuff</Link>
        <Link href={secondary.href}>{secondary.label}</Link>
      </div>
    </nav>
  );
}
