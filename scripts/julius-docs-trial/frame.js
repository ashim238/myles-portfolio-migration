(() => {
  const trial = document.querySelector("#trial");
  const feedback = document.querySelector("#feedback");
  const home = trial.querySelector('[data-view="home"]');
  const search = home.querySelector("input");
  const filters = [...home.querySelectorAll('[aria-pressed]')];
  const homeTitle = home.querySelector(".ds-hero h1");
  homeTitle.tabIndex = -1;

  function message(type, props = {}) {
    if (parent !== window) parent.postMessage({ channel: "julius-docs-preview", type, ...props }, "*");
  }
  function measure() {
    message("resize", { height: Math.ceil(trial.getBoundingClientRect().height) });
  }
  window.addEventListener("message", (event) => {
    if (event.source === parent && event.data?.channel === "julius-docs-preview" && event.data.type === "measure") measure();
  });
  new ResizeObserver(measure).observe(trial);
  document.fonts.ready.then(measure);
  function say(text) {
    feedback.textContent = text;
  }

  function setFilter(button, value) {
    button.setAttribute("aria-pressed", String(value));
    button.classList.toggle("Chip-module_selected_yrUXw", value);
  }
  function readSearch() {
    return { term: search.value, filters: filters.map(b => b.getAttribute("aria-pressed") === "true") };
  }
  let saved = readSearch();

  function show(id, fromLink) {
    const views = [...trial.querySelectorAll("[data-view]")];
    const selected = views.find(view => view.dataset.view === id) || home;
    for (const view of views) view.hidden = view !== selected;
    const isHome = selected === home;
    document.documentElement.dataset.theme = isHome ? "dark" : "light";
    feedback.textContent = "";
    for (const link of trial.querySelectorAll(".trial-nav a")) {
      if (link.hash === "#" + selected.dataset.view) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    if (fromLink) {
      selected.querySelector("h1").focus({ preventScroll: true });
      message("navigate");
    }
    measure();
  }
  trial.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (link) {
      if (link.hash === location.hash) show(link.hash.slice(1), true);
      return;
    }
    const label = event.target.closest('[class*="Toggle-module_label"]');
    const button = label?.parentElement.querySelector('[role="switch"]') || event.target.closest("button");
    if (!button) return;
    if (button.getAttribute("role") === "switch") {
      button.setAttribute("aria-checked", String(button.getAttribute("aria-checked") !== "true"));
    } else if (button.hasAttribute("aria-pressed")) {
      setFilter(button, button.getAttribute("aria-pressed") !== "true");
    } else if (home.contains(button) && button.textContent.trim() === "Save search") {
      saved = readSearch();
      say("Search saved in this preview.");
    } else if (home.contains(button)) {
      search.value = saved.term;
      filters.forEach((filter, i) => setFilter(filter, saved.filters[i]));
      say("Back to your saved search.");
    } else {
      say("You selected “" + button.textContent.trim() + "” in the example.");
    }
  });
  window.addEventListener("hashchange", () => show(location.hash.slice(1), true));
  show(location.hash.slice(1), false);
})();
