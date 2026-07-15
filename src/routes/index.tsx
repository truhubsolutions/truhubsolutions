import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "../features/studio/StudioApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TruHub Lab — Visual Simulation Studio" },
      {
        name: "description",
        content:
          "Design, simulate and analyze electrical, control and signal systems visually in TruHub Lab.",
      },
    ],
  }),
  component: StudioApp,
});
