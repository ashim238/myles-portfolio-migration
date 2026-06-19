export function NaviFooter() {
  const cols: { heading: string; links: string[] }[] = [
    { heading: "Explore Navi", links: ["Host an event", "Trust and safety", "Partner resources"] },
    { heading: "About", links: ["What's Navi?", "Careers", "Newsroom", "Privacy policy"] },
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
                <li key={l}>
                  <a href="/work/navi">{l}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
