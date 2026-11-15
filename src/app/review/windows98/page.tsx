import { notFound } from "next/navigation";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { Myles97Icon } from "@/components/myles-97/icons";
import { TemplateSwitcher } from "@/components/understandingfafsa";

export const metadata = { title: "Windows 98 implementation review", robots: { index: false, follow: false } };
export default async function Review({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  const { view } = await searchParams;
  const path = view === "tiktok" ? "/work/tiktok#tt-system" : view === "home" ? "/" : "/work/understandingfafsa";
  return <ReaderShell slug="understandingfafsa" title="Visual system review" className="uf-page">
    <section style={{ maxWidth: 1100, margin: "32px auto", padding: 16 }}>
      <h1>Windows 98 implementation review</h1>
      <p>Preview-only specimens. Same production components and tokens; project artwork remains unchanged.</p>
      <div className="myles97-window" data-focused="true" style={{ position: "relative", width: "100%", minHeight: 0, height: "auto", marginBlock: 24 }}>
        <div className="myles97-titlebar" style={{ cursor: "default" }}><Myles97Icon name="display" size={16} compact variant="color" /><strong>Shared control states</strong></div>
        <div style={{ display: "flex", gap: 12, padding: 16, flexWrap: "wrap" }}>
          <button className="reader-control" style={{ paddingInline: 16 }}>Default / hover / press</button>
          <button className="reader-control" style={{ paddingInline: 16 }} aria-pressed="true">Selected</button>
          <button className="reader-control" style={{ paddingInline: 16 }} disabled>Unavailable</button>
          <label>Keyboard focus <input aria-label="Specimen text field" defaultValue="Myles 98" style={{ background: "white", color: "#111", padding: 8, boxShadow: "var(--m97-bevel-recessed)", border: 0, borderRadius: 0 }} /></label>
        </div>
      </div>
      <p><a href="?view=home">Home</a> · <a href="?view=fafsa">FAFSA opening</a> · <a href="?view=tiktok">TikTok evidence</a></p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {[320, 390, 430].map(width => <figure key={width}><figcaption>{width} × 844 CSS px; touch hardware is not emulated</figcaption><iframe title={`${width}px ${view ?? "fafsa"}`} src={path} width={width} height={844} style={{ boxSizing: "content-box", border: "1px solid #808080", maxWidth: "100%", background: "#f5f3ea" }} /></figure>)}
      </div>
      <h2>Actual newsletter variant controls</h2>
      <TemplateSwitcher />
    </section>
  </ReaderShell>;
}
