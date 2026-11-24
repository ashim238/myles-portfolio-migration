/* Rebuild from the local, built components-v0.12.0 Astro site. Import only
   the public specimen and the usage sheets for its four controls. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = process.argv[2];
if (!dist) throw new Error("Provide the archived site's dist directory.");

const read = (file) => fs.readFileSync(path.join(dist, file), "utf8");
const open = (file) => new JSDOM(read(file)).window.document;
const local = (filename) => fs.readFileSync(path.join(here, filename), "utf8");
const home = open("index.html");
const directory = open("components/index.html");
const components = ["button", "chip", "input-field", "toggle"];
const dest = path.resolve(here, "../../public/projects/julius-design-system/docs-preview/index.html");

function clean(element) {
  const node = element.cloneNode(true);
  node.querySelectorAll("script,style").forEach((el) => el.remove());
  node.querySelectorAll("astro-island,astro-slot").forEach((el) => el.replaceWith(...el.childNodes));
  for (const child of [node, ...node.querySelectorAll("*")]) {
    for (const attribute of child.getAttributeNames()) {
      if (/^data-astro-|^on/i.test(attribute)) child.removeAttribute(attribute);
    }
  }
  return node;
}

const brand = clean(home.querySelector('header a[href="/"] svg'));
const hero = clean(home.querySelector(".ds-hero"));
const actionRow = hero.querySelector(".ds-hero__copy .ds-row");
actionRow.remove();
const guideLink = home.createElement("a");
guideLink.href = "#toggle";
guideLink.className = "toggle-guide-link";
guideLink.textContent = "Open the Toggle guide";
hero.querySelector(".ds-hero__art").append(guideLink);

const sourceCards = components.map((key) => {
  const item = clean(directory.querySelector('a[href="/components/'+key+'/"]').closest("li"));
  item.querySelector("a").setAttribute("href", "#"+key);
  return item.outerHTML;
});

const guides = components.map((key) => {
  const doc = open("components/"+key+"/usage/index.html");
  const title = doc.querySelector("h1").textContent;
  const pair = clean(doc.querySelector(".ds-dodont"));
  // Replace a fictitious personal name used as placeholder in the input example.
  for (const sample of pair.querySelectorAll('input[placeholder="Alex Rivera"]')) sample.placeholder = "Your name";
  // Each original page starts its React-generated IDs at the same seed.
  // Give each imported subtree its own accessible label and control references.
  for (const node of pair.querySelectorAll("[id],[for],[aria-labelledby],[aria-describedby]")) {
    for (const name of ["id","for","aria-labelledby","aria-describedby"]) {
      if (node.hasAttribute(name)) node.setAttribute(name, node.getAttribute(name).split(/\s+/).map(id => key+"-"+id).join(" "));
    }
  }
  const code = key === "button" ? '<details class="example-code"><summary>Code for the first example</summary><pre tabindex="0"><code>&lt;Button variant="secondary"&gt;Cancel&lt;/Button&gt;\n&lt;Button&gt;Save&lt;/Button&gt;</code></pre></details>' : "";
  const back = key === "toggle" ? '<a href="#home">Back to job search</a>' : "";
  return '<section data-view="'+key+'" data-theme="light" hidden><div class="guide-head" data-theme="dark"><div class="ds-wrap">'+back+'<h1 tabindex="-1">'+title+'</h1><p>Usage</p></div></div><div class="ds-wrap guide-body">'+pair.outerHTML+code+'</div></section>';
});

const fonts = fs.readdirSync(path.join(dist, "_astro"));
let css = [...home.querySelectorAll('link[rel="stylesheet"]')].map(link => read(link.getAttribute("href"))).join("\n");
// Keep only the Latin font data used by these English-language excerpts.
css = css.replace(/@font-face\s*\{[^}]*\}/g, (rule) => {
  const file = fonts.find(f => /^inter-latin-(400|500|600)-.*\.woff2$/.test(f) && rule.includes(f));
  if (!file) return "";
  const bytes = fs.readFileSync(path.join(dist,"_astro",file)).toString("base64");
  return rule.replace(/src:[^;}]+/, "src:url(data:font/woff2;base64,"+bytes+") format('woff2')");
});
const html = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; img-src data:; form-action 'none'; base-uri 'none'">
  <title>Julius design system preview</title>
  <style>${css}\n${local("frame.css")}</style>
</head>
<body>
  <div id="trial">
    <nav class="trial-nav" aria-label="Documentation preview" data-theme="dark">
      <a href="#home" class="brand" aria-label="Julius docs home">${brand.outerHTML}</a>
      <a href="#components">Components</a>
    </nav>
    <main>
      <section data-view="home">${hero.outerHTML}</section>
      <section data-view="components" hidden>
        <div class="guide-head" data-theme="dark">
          <div class="ds-wrap">
            <h1 tabindex="-1">Components</h1>
            <p>The four controls in the homepage example.</p>
          </div>
        </div>
        <div class="ds-wrap guide-body">
          <ul class="ds-index" role="list">${sourceCards.join("")}</ul>
        </div>
      </section>
      ${guides.join("")}
    </main>
    <p id="feedback" role="status" aria-live="polite"></p>
  </div>
  <script>${local("frame.js")}</script>
</body>
</html>`;
fs.writeFileSync(dest, html);
