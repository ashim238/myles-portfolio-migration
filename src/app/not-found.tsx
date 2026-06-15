import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function NotFound() {
  return (
    <main className="page-shell home-page" id="main-content">
      <SiteNav />

      <section className="not-found" aria-labelledby="not-found-heading">
        <div className="not-found-content">
          <p className="not-found-label" aria-hidden="true">
            Error
          </p>
          <h1 id="not-found-heading" className="not-found-title">
            Page not found
          </h1>
          <p className="not-found-body">
            Nothing here, just empty pixels. The page you&rsquo;re
            looking for was moved, removed, or never existed.
          </p>
          <Link href="/" className="not-found-link">
            Take me home
          </Link>
        </div>
        <p className="not-found-code" aria-hidden="true">
          <span className="not-found-digit">4</span>
          <span className="not-found-digit">0</span>
          <span className="not-found-digit">4</span>
        </p>
      </section>
    </main>
  );
}
