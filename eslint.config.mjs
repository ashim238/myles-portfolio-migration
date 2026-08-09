import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/components/project-enter-transition.tsx"],
    rules: {
      // This route-driven overlay is an explicit finite-state machine. Its
      // pathname effect advances an existing transition into the settle phase.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local agent plugins and generated audit state are not application code.
    ".agents/**",
    ".claude/skills/**",
    ".codex/**",
    ".critique-assessment-a/**",
    ".cursor/**",
    ".impeccable/**",
    ".planning/**",
    ".playwright-mcp/**",
    ".superpowers/**",
    ".worktrees/**",
  ]),
]);

export default eslintConfig;
