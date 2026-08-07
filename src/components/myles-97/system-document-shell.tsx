import Link from "next/link";
import type { ReactNode } from "react";
import { Myles97Icon, iconForProgram } from "@/components/myles-97/icons";
import type { SecondaryProgramId } from "@/components/myles-97/secondary-programs";

type SystemDocumentShellProps = {
  program: SecondaryProgramId;
  title: string;
  children: ReactNode;
};

export function SystemDocumentShell({
  program,
  title,
  children,
}: SystemDocumentShellProps) {
  return (
    <>
      <header className="myles98-document-header" aria-label={`${title} document controls`}>
        <Link className="myles98-document-back" href="/#selected-work">
          <span aria-hidden="true">←</span>
          <span>Selected Work</span>
        </Link>
        <div className="myles98-document-identity">
          <Myles97Icon name={iconForProgram(program)} size={18} aria-hidden="true" />
          <strong>{title}</strong>
        </div>
      </header>
      <main
        className={`page-shell project-page myles98-system-document myles98-system-document--${program}`}
        id="main-content"
        data-m98-document={program}
      >
        {children}
      </main>
    </>
  );
}
