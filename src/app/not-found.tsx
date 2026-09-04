import Link from "next/link";
import { Myles97Icon } from "@/components/myles-97/icons";

export default function NotFound() {
  return (
    <main className="myles97-error-shell" id="main-content">
      <section className="myles97-system-dialog" aria-labelledby="not-found-heading">
        <header className="myles97-system-dialog-titlebar">
          <Myles97Icon name="app" size={16} aria-hidden="true" />
          <strong>Myles 98</strong>
        </header>
        <div className="myles97-system-dialog-body">
          <div className="myles97-system-dialog-mark" aria-hidden="true">
            404
          </div>
          <div>
            <p className="myles97-eyebrow">System message</p>
            <h1 id="not-found-heading">Page not found</h1>
            <p>
              This address does not point to a portfolio page. The desktop and
              Work Stuff are both still available.
            </p>
          </div>
        </div>
        <div className="myles97-system-dialog-actions">
          <Link href="/">Return to Desktop</Link>
          <Link href="/#selected-work">Open Work Stuff</Link>
        </div>
      </section>
    </main>
  );
}
