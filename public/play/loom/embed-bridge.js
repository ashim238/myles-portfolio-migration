(() => {
  const origin = window.location.origin;
  const systemQuery = window.matchMedia("(prefers-color-scheme: light)");
  const contentRoot = document.querySelector("[data-embed-content]");
  let parentThemeReceived = false;

  function isTheme(value) {
    return value === "light" || value === "dark";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  function reportHeight() {
    if (window.parent === window) return;
    const bodyTop = document.body.getBoundingClientRect().top;
    const contentBottom = (
      contentRoot ?? document.body
    ).getBoundingClientRect().bottom;
    const height = Math.ceil(Math.max(1, contentBottom - bodyTop));
    window.parent.postMessage({ type: "loom:resize", height }, origin);
  }

  applyTheme(systemQuery.matches ? "light" : "dark");

  window.addEventListener("message", (event) => {
    if (event.origin !== origin || event.source !== window.parent) return;
    if (event.data?.type !== "loom:theme" || !isTheme(event.data.theme)) return;
    parentThemeReceived = true;
    applyTheme(event.data.theme);
    reportHeight();
  });

  systemQuery.addEventListener("change", (event) => {
    if (!parentThemeReceived) applyTheme(event.matches ? "light" : "dark");
  });

  const resizeObserver = new ResizeObserver(reportHeight);
  if (contentRoot) resizeObserver.observe(contentRoot);
  resizeObserver.observe(document.body);
  window.addEventListener("load", reportHeight);
})();
