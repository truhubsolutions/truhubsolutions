import type { StudioProject } from "../store/studio-store";

const LS_CURRENT = "truhub_lab:current";
const LS_RECENTS = "truhub_lab:recents"; // array of {name, ts, project}

export interface RecentEntry {
  name: string;
  ts: number;
  project: StudioProject;
}

export function saveCurrent(p: StudioProject) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_CURRENT, JSON.stringify({ ...p, updatedAt: Date.now() }));
  const recents = getRecents().filter((r) => r.name !== p.name);
  recents.unshift({ name: p.name, ts: Date.now(), project: p });
  localStorage.setItem(LS_RECENTS, JSON.stringify(recents.slice(0, 8)));
}

export function loadCurrent(): StudioProject | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LS_CURRENT);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudioProject;
  } catch {
    return null;
  }
}

export function getRecents(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_RECENTS) ?? "[]");
  } catch {
    return [];
  }
}

export function exportProjectFile(p: StudioProject) {
  const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${p.name.replace(/\s+/g, "-").toLowerCase()}.trulab.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProjectFile(): Promise<StudioProject | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return resolve(null);
      try {
        const text = await f.text();
        resolve(JSON.parse(text) as StudioProject);
      } catch {
        resolve(null);
      }
    };
    input.click();
  });
}

export function exportSamplesCSV(
  samples: { t: number; values: Record<string, number> }[],
  projectName: string,
) {
  if (!samples.length) return;
  const keys = Array.from(new Set(samples.flatMap((s) => Object.keys(s.values))));
  const header = ["t", ...keys].join(",");
  const rows = samples.map((s) => [s.t, ...keys.map((k) => s.values[k] ?? "")].join(","));
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-trace.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCanvasPNG(el: HTMLElement, projectName: string) {
  // Simple SVG snapshot fallback → rasterize via canvas.
  // Uses html-to-image-free approach: capture visible canvas viewport.
  const svg = el.querySelector("svg");
  if (!svg) return;
  const data = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = svg.clientWidth || 1200;
    c.height = svg.clientHeight || 800;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0b0f19";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0);
    c.toBlob((blob) => {
      if (!blob) return;
      const u = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = u;
      a.download = `${projectName}.png`;
      a.click();
      URL.revokeObjectURL(u);
      URL.revokeObjectURL(url);
    }, "image/png");
  };
  img.src = url;
}
