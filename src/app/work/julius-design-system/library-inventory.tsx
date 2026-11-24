// The categories and their order follow the November docs site. Child parts
// such as sidebar items are documented under their parent component.
const componentGroups = [
  { name: "Actions", glyph: "actions", components: ["Button", "Icon button", "Icon button togglable", "Favorite button"] },
  { name: "Inputs", glyph: "inputs", components: ["Input field", "Search", "Dropdown", "Checkbox", "Toggle"] },
  { name: "Labels and status", glyph: "status", components: ["Label", "Badge", "Chip", "Progress", "Meter"] },
  { name: "Messages", glyph: "feedback", components: ["Toast", "Tooltip"] },
  { name: "Content", glyph: "content", components: ["Card", "Table", "Logo"] },
  { name: "Navigation", glyph: "navigation", components: ["Sidebar", "Site header", "Navigation menu"] },
];

const familyCount = 9;
const findings = [
  { component: "Sidebar", families: 5, label: "Five families", finding: "used the shared sidebar." },
  { component: "Dialog", families: 7, label: "Seven families", finding: "built their own dialogs to confirm a choice or warn someone before they left a form." },
  { component: "Drawer", families: 9, label: "All nine families", finding: "built their own drawer. That put a shared drawer at the top of my list." },
];

export function LibraryInventory() {
  return (
    <section className="julius-inventory" aria-labelledby="component-inventory">
      <h2 id="component-inventory">Auditing the product suite</h2>
      <p>I looked through 17 product and prototype repos to see where teams used our components and where they’d made their own. Some repos were different versions of the same product, so I grouped those together. That gave me nine product families to compare.</p>
      <div className="julius-audit-sheet">
        <table>
          <caption className="sr-only">Three findings from the component audit across nine product families</caption>
          <thead><tr><th scope="col">Component</th><th scope="col">What I found in the code</th></tr></thead>
          <tbody>
            {findings.map(({ component, families, label, finding }) => (
              <tr key={component}>
                <th scope="row">
                  <div className="julius-audit-measure">
                    <span>{component}</span>
                    <span className="julius-audit-tally" aria-hidden="true">
                      {Array.from({ length: familyCount }, (_, index) => (
                        <i className={index < families ? "counted" : undefined} key={index} />
                      ))}
                    </span>
                  </div>
                </th>
                <td><strong>{label}</strong> {finding}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="julius-release-index">
        <summary>
          <span>Browse all 22 components <small>November release</small></span>
          <span className="julius-release-toggle" aria-hidden="true" />
        </summary>
        <div className="julius-release-groups">
          {componentGroups.map(({ name, glyph, components }) => (
            <section key={glyph}>
              <h3>
                <svg width="32" height="32" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                  <use href={`/projects/julius-design-system/component-groups.svg#${glyph}`} />
                </svg>
                {name}
              </h3>
              <ul>
                {components.map(component => <li key={component}>{component}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </details>
    </section>
  );
}
