export function NaviFooter() {
  const cols: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "Explore Navi",
      links: [
        { label: "Host an event", href: "/work/navi/demo/host" },
        { label: "Trust and safety", href: "/work/navi" },
        { label: "Partner resources", href: "/work/navi" },
      ],
    },
    {
      heading: "About",
      links: [
        { label: "Where bookings go", href: "/work/navi/demo/impact" },
        { label: "What's Navi?", href: "/work/navi" },
        { label: "Careers", href: "/work/navi" },
        { label: "Newsroom", href: "/work/navi" },
        { label: "Privacy policy", href: "/work/navi" },
      ],
    },
  ];
  return (
    <footer className="nv-footer" role="contentinfo">
      <div className="nv-footer-brand">
        <p className="nv-footer-tagline">Neighborhood-led experiences in New York City.</p>
        <a className="nv-footer-email" href="mailto:contact@navi.com">
          contact@navi.com
        </a>
      </div>
      <div className="nv-footer-cols">
        {cols.map((c) => (
          <nav key={c.heading} className="nv-footer-col" aria-label={c.heading}>
            <h2 className="nv-footer-heading">{c.heading}</h2>
            <ul>
              {c.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
