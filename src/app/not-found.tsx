import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function NotFound() {
  return (
    <main className="page-shell home-page" id="main-content">
      <SiteNav />

      <section className="not-found">
        <p className="not-found-code" aria-hidden="true">
          <span className="not-found-digit">4</span>
          <span className="not-found-digit">0</span>
          <span className="not-found-digit">4</span>
        </p>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-body">
          Nothing here &mdash; just empty pixels. The page you&rsquo;re looking
          for was moved, removed, or never existed.
        </p>
        <Link href="/" className="not-found-link">
          Take me home
        </Link>
      </section>
    </main>
  );
}
