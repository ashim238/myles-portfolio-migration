"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Control = { name: string; options: string[] };
type Values = Record<string, string>;

export function PropPlayground({
  component,
  controls,
  initial,
  render,
}: {
  component: string;
  controls: Control[];
  initial: Values;
  render: (values: Values) => ReactNode;
}) {
  const [values, setValues] = useState<Values>(initial);
  const code = `<${component} ${Object.entries(values)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ")} />`;

  return (
    <div className="nv-playground">
      <div className="nv-playground-stage">{render(values)}</div>
      <div className="nv-playground-controls">
        {controls.map((c) => (
          <fieldset key={c.name} className="nv-playground-control" role="radiogroup" aria-label={c.name}>
            <legend>{c.name}</legend>
            {c.options.map((opt) => (
              <label key={opt} className="nv-playground-opt">
                <input
                  type="radio"
                  name={c.name}
                  checked={values[c.name] === opt}
                  onChange={() => setValues((v) => ({ ...v, [c.name]: opt }))}
                />
                {opt}
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <pre className="nv-playground-code" data-testid="nv-playground-code">
        {code}
      </pre>
    </div>
  );
}
