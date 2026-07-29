(() => {
  const origin = window.location.origin;
  const systemQuery = window.matchMedia("(prefers-color-scheme: light)");
  let parentThemeReceived = false;

  function isTheme(value) {
    return value === "light" || value === "dark";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  function reportHeight() {
    if (window.parent === window) return;
    const height = Math.ceil(
      Math.max(
        document.body.scrollHeight,
        document.documentElement.getBoundingClientRect().height,
      ),
    );
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
  resizeObserver.observe(document.documentElement);
  resizeObserver.observe(document.body);
  window.addEventListener("load", reportHeight);
})();
