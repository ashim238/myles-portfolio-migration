export function NaviFooter() {
  const cols: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "Explore Navi",
      links: [
        { label: "Experiences", href: "/work/navi/demo" },
        { label: "Where bookings go", href: "/work/navi/demo/impact" },
        { label: "Host an event", href: "/work/navi/demo/host" },
        { label: "Design system", href: "/work/navi/system" },
      ],
    },
    {
      heading: "Project",
      links: [
        { label: "Read the case study", href: "/work/navi" },
      ],
    },
  ];
  return (
    <footer className="nv-footer" role="contentinfo">
      <div className="nv-footer-brand">
        <p className="nv-footer-tagline">
          A working portfolio rebuild of a graduate-studio concept.
        </p>
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
