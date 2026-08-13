import { hydrateRoot } from "react-dom/client";
import {
  Task5HydratedFixture,
  type Task5FixtureKind,
} from "./task-5-hydrated-fixture";
import type { ProgramDefinition } from "@/lib/myles-97/programs";

declare global {
  interface Window {
    __TASK5_PROGRAMS__?: readonly ProgramDefinition[];
  }
}

const root = document.getElementById("task5-root");
const fixture = root?.dataset.fixture as Task5FixtureKind | undefined;
const programs = window.__TASK5_PROGRAMS__;

if (!root || !fixture || !programs) {
  throw new Error("Incomplete Task 5 hydration fixture");
}

hydrateRoot(
  root,
  <Task5HydratedFixture fixture={fixture} programs={programs} />,
);
