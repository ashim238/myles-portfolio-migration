import { CommandIcon } from "@/components/myles-97/command-icon";
import Link from "next/link";
import type { ReactNode } from "react";
import { Myles97Icon, iconForProgram } from "@/components/myles-97/icons";
import type { SecondaryProgramId } from "@/components/myles-97/secondary-programs";

type SystemDocumentShellProps = {
  program: SecondaryProgramId;
  title: string;
  children: ReactNode;
};

const documentTabs = [
  { program: "about", href: "/about", label: "About" },
  { program: "loose-parts", href: "/play", label: "Loose Parts" },
  { program: "resume", href: "/resume", label: "Résumé" },
] as const;

export function SystemDocumentShell({
  program,
  title,
  children,
}: SystemDocumentShellProps) {
  const icon = iconForProgram(program);

  return (
    <div
      className="myles98-document-canvas"
      data-m98-document-canvas={program}
    >
      <div
        className="myles98-document-window"
        data-m98-document-window={program}
      >
        <header
          className="myles98-document-header"
          aria-label={`${title} document controls`}
        >
          <div className="myles98-document-titlebar">
            <Link className="myles98-document-back reader-control" href="/#selected-work">
              <CommandIcon name="back" />
              <span>Work Stuff</span>
            </Link>

            <div className="myles98-document-identity">
              <Myles97Icon name={icon} size={18} aria-hidden="true" />
              <strong>{title}</strong>
            </div>

            <span className="myles98-document-edition" aria-hidden="true">
              Myles 98
            </span>
          </div>

          <nav
            className="myles98-document-toolbar"
            aria-label={`${title} document location`}
          >
            <span className="myles98-document-path">
              <Myles97Icon name="folder" size={14} aria-hidden="true" />
              <span>Desktop</span>
              <span aria-hidden="true">/</span>
              <strong>{title}</strong>
            </span>
            <span className="document-tabs">
              {documentTabs.map((tab) => (
                <Link key={tab.program} href={tab.href} aria-current={program === tab.program ? "page" : undefined}>
                  <Myles97Icon name={iconForProgram(tab.program)} size={16} aria-hidden="true" />
                  {tab.label}
                </Link>
              ))}
            </span>
          </nav>
        </header>

        <main
          className={`page-shell project-page myles98-system-document myles98-system-document--${program}`}
          id="main-content"
          data-m98-document={program}
        >
          {children}
        </main>

        <footer
          className="myles98-document-statusbar"
          aria-label={`${title} document status`}
        >
          <span>{title}</span>
          <span>Ready</span>
        </footer>
      </div>
    </div>
  );
}
