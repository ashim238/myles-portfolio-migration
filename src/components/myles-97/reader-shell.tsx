import type { ReactNode } from "react";
import { ReaderHeader } from "@/components/myles-97/reader-header";

type ReaderShellProps = {
  slug: string;
  title: string;
  className?: string;
  children: ReactNode;
};

export function ReaderShell({
  slug,
  title,
  className = "",
  children,
}: ReaderShellProps) {
  const projectClasses = ["page-shell", "project-page", "reader-mode", className]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <ReaderHeader slug={slug} title={title} />
      <main
        className={projectClasses}
        id="main-content"
        data-project-slug={slug}
        data-reader-mode={slug}
      >
        {children}
      </main>
    </>
  );
}
