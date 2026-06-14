export const PROJECT_ENTER_REQUEST = "project-enter-request";
export const PROJECT_ENTER_COMPLETE = "project-enter-complete";

export type ProjectEnterRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ProjectEnterRequestDetail = {
  slug: string;
  href: string;
  rect: ProjectEnterRect;
  imageSrc: string;
  imageAlt: string;
  borderRadius: string;
};

export function dispatchProjectEnterRequest(detail: ProjectEnterRequestDetail): void {
  window.dispatchEvent(
    new CustomEvent<ProjectEnterRequestDetail>(PROJECT_ENTER_REQUEST, { detail }),
  );
}

export function computeCoverScale(rect: ProjectEnterRect): number {
  return Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.04;
}

export function computeCenterOffset(rect: ProjectEnterRect): { x: number; y: number } {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return {
    x: window.innerWidth / 2 - centerX,
    y: window.innerHeight / 2 - centerY,
  };
}

export const PROJECT_ENTER_ZOOM_IN_MS = 680;
export const PROJECT_ENTER_SETTLE_MS = 560;

export function queryProjectCover(slug: string): HTMLElement | null {
  const page = document.querySelector<HTMLElement>(
    `.project-page[data-project-slug="${slug}"]`,
  );
  if (!page) return null;

  return (
    page.querySelector<HTMLElement>(".project-cover-image") ??
    page.querySelector<HTMLElement>("[data-project-enter-cover]")
  );
}

export function waitForProjectCover(slug: string, attempts = 48): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    let remaining = attempts;

    const tick = () => {
      const cover = queryProjectCover(slug);
      if (cover) {
        resolve(cover);
        return;
      }

      remaining -= 1;
      if (remaining <= 0) {
        resolve(null);
        return;
      }

      requestAnimationFrame(tick);
    };

    tick();
  });
}
