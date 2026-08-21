(() => {
  const origin = window.location.origin;
  const contentRoot = document.querySelector("[data-embed-content]");

  function reportHeight() {
    if (window.parent === window) return;

    const bodyTop = document.body.getBoundingClientRect().top;
    const contentBottom = (contentRoot ?? document.body).getBoundingClientRect().bottom;
    const height = Math.ceil(Math.max(1, contentBottom - bodyTop));
    window.parent.postMessage({ type: "loom:resize", height }, origin);
  }

  const resizeObserver = new ResizeObserver(reportHeight);
  if (contentRoot) resizeObserver.observe(contentRoot);
  resizeObserver.observe(document.body);
  window.addEventListener("load", reportHeight);
})();
