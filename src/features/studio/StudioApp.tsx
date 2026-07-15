import { useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  Undo2,
  Redo2,
  Copy,
  ClipboardPaste,
  Trash2,
  Save,
  FolderOpen,
  Download,
  Upload,
  FilePlus2,
  Grid3x3,
  Magnet,
  Image as ImageIcon,
  RotateCw,
} from "lucide-react";
import { StudioCanvasWithProvider } from "../canvas/StudioCanvas";
import { BlockLibraryPanel, PropertyInspectorPanel, ConsolePanel } from "../panels/Panels";
import { ScopePanel } from "../scope/ScopePanel";
import { useStudio } from "../store/studio-store";
import { SimulationEngine } from "../engine/simulation";
import {
  saveCurrent,
  loadCurrent,
  exportProjectFile,
  importProjectFile,
  exportSamplesCSV,
  exportCanvasPNG,
  getRecents,
} from "../project/persistence";

export function StudioApp() {
  const engineRef = useRef<SimulationEngine | null>(null);
  const {
    nodes,
    edges,
    running,
    simSpeed,
    dt,
    project,
    samples,
    setRunning,
    setSimSpeed,
    setDt,
    pushSample,
    pushLog,
    clearSamples,
    undo,
    redo,
    copySelection,
    pasteClipboard,
    deleteSelection,
    rotateNode,
    selection,
    toggleGrid,
    toggleSnap,
    showGrid,
    gridSnap,
    newProject,
    loadProject,
    renameProject,
  } = useStudio();

  // Init engine
  useEffect(() => {
    engineRef.current = new SimulationEngine({
      dt,
      speed: simSpeed,
      onStep: (r) => pushSample(r.t, r.channels),
      onLog: (l, m) => pushLog(l, m),
    });
    // hydrate from localStorage on first load
    const saved = loadCurrent();
    if (saved && saved.nodes?.length) loadProject(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep engine in sync
  useEffect(() => {
    if (!engineRef.current) return;
    (engineRef.current as unknown as { opts: { dt: number; speed: number } }).opts.dt = dt;
    (engineRef.current as unknown as { opts: { dt: number; speed: number } }).opts.speed = simSpeed;
  }, [dt, simSpeed]);

  // Reload graph in engine on nodes/edges change
  useEffect(() => {
    if (!engineRef.current) return;
    const wasRunning = engineRef.current.isRunning();
    engineRef.current.load(
      nodes.map((n) => ({ id: n.id, type: n.data.blockType, params: n.data.params })),
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? "out",
        targetHandle: e.targetHandle ?? "in",
      })),
    );
    if (wasRunning) engineRef.current.play();
  }, [nodes, edges]);

  // Autosave every 15s
  useEffect(() => {
    const id = setInterval(() => {
      saveCurrent({ ...project, nodes, edges, updatedAt: Date.now() });
    }, 15000);
    return () => clearInterval(id);
  }, [nodes, edges, project]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (meta && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (meta && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        redo();
      } else if (meta && e.key === "c") copySelection();
      else if (meta && e.key === "v") pasteClipboard();
      else if (e.key === "Delete" || e.key === "Backspace") deleteSelection();
      else if (e.key === "r" && selection[0]) rotateNode(selection[0]);
      else if (e.key === " ") {
        e.preventDefault();
        handlePlayPause();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, undo, redo, copySelection, pasteClipboard, deleteSelection, rotateNode]);

  function handlePlayPause() {
    if (!engineRef.current) return;
    if (running) {
      engineRef.current.pause();
      setRunning(false);
    } else {
      engineRef.current.play();
      setRunning(true);
    }
  }
  function handleStop() {
    if (!engineRef.current) return;
    engineRef.current.stop();
    setRunning(false);
    clearSamples();
  }

  const tb =
    "inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-200 rounded hover:bg-slate-800 border border-transparent hover:border-slate-700";
  const tbActive = "bg-sky-500/10 border-sky-500/30 text-sky-300";

  return (
    <div className="h-screen w-screen bg-[#030712] text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-1.5 bg-[#0b1220]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded bg-gradient-to-br from-sky-400 to-blue-600" />
            <span className="text-sm font-semibold tracking-tight">TruHub Lab</span>
            <span className="text-[10px] text-slate-500 ml-1">v0.1</span>
          </div>
          <input
            value={project.name}
            onChange={(e) => renameProject(e.target.value)}
            className="bg-transparent text-xs text-slate-300 border-b border-transparent hover:border-slate-700 focus:border-sky-400 outline-none px-1"
          />
        </div>
        <div className="flex items-center gap-1">
          <button className={tb} onClick={() => newProject("Untitled")}>
            <FilePlus2 className="h-3.5 w-3.5" /> New
          </button>
          <button
            className={tb}
            onClick={async () => {
              const p = await importProjectFile();
              if (p) loadProject(p);
            }}
          >
            <FolderOpen className="h-3.5 w-3.5" /> Open
          </button>
          <button
            className={tb}
            onClick={() => saveCurrent({ ...project, nodes, edges, updatedAt: Date.now() })}
          >
            <Save className="h-3.5 w-3.5" /> Save
          </button>
          <button
            className={tb}
            onClick={() => exportProjectFile({ ...project, nodes, edges })}
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button
            className={tb}
            onClick={async () => {
              const p = await importProjectFile();
              if (p) loadProject(p);
            }}
          >
            <Upload className="h-3.5 w-3.5" /> Import
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-slate-800 px-2 py-1 bg-[#0b1220]/60">
        <button
          className={`${tb} ${running ? tbActive : ""}`}
          onClick={handlePlayPause}
          title="Play / Pause (Space)"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? "Pause" : "Play"}
        </button>
        <button className={tb} onClick={handleStop} title="Stop & Reset">
          <Square className="h-3.5 w-3.5" /> Stop
        </button>
        <div className="mx-2 h-5 w-px bg-slate-800" />
        <label className="text-[10px] text-slate-400 flex items-center gap-1">
          dt
          <input
            type="number"
            value={dt}
            step={0.001}
            min={0.0001}
            onChange={(e) => setDt(Math.max(0.0001, Number(e.target.value)))}
            className="w-16 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-slate-100"
          />
        </label>
        <label className="text-[10px] text-slate-400 flex items-center gap-1 ml-2">
          speed
          <input
            type="range"
            min={1}
            max={20}
            value={simSpeed}
            onChange={(e) => setSimSpeed(Number(e.target.value))}
          />
          <span className="w-6 text-right">{simSpeed}×</span>
        </label>
        <div className="mx-2 h-5 w-px bg-slate-800" />
        <button className={tb} onClick={undo} title="Undo (Ctrl+Z)">
          <Undo2 className="h-3.5 w-3.5" /> Undo
        </button>
        <button className={tb} onClick={redo} title="Redo (Ctrl+Y)">
          <Redo2 className="h-3.5 w-3.5" /> Redo
        </button>
        <button className={tb} onClick={copySelection} title="Copy (Ctrl+C)">
          <Copy className="h-3.5 w-3.5" /> Copy
        </button>
        <button className={tb} onClick={pasteClipboard} title="Paste (Ctrl+V)">
          <ClipboardPaste className="h-3.5 w-3.5" /> Paste
        </button>
        <button className={tb} onClick={deleteSelection} title="Delete (Del)">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
        <button
          className={tb}
          onClick={() => selection[0] && rotateNode(selection[0])}
          title="Rotate 90° (R)"
        >
          <RotateCw className="h-3.5 w-3.5" /> Rotate
        </button>
        <div className="mx-2 h-5 w-px bg-slate-800" />
        <button className={`${tb} ${showGrid ? tbActive : ""}`} onClick={toggleGrid}>
          <Grid3x3 className="h-3.5 w-3.5" /> Grid
        </button>
        <button className={`${tb} ${gridSnap ? tbActive : ""}`} onClick={toggleSnap}>
          <Magnet className="h-3.5 w-3.5" /> Snap
        </button>
        <div className="mx-2 h-5 w-px bg-slate-800" />
        <button className={tb} onClick={() => exportSamplesCSV(samples, project.name)}>
          <Download className="h-3.5 w-3.5" /> CSV
        </button>
        <button
          className={tb}
          onClick={() =>
            exportCanvasPNG(document.querySelector(".react-flow") as HTMLElement, project.name)
          }
        >
          <ImageIcon className="h-3.5 w-3.5" /> PNG
        </button>
        <div className="ml-auto text-[10px] text-slate-500 flex items-center gap-3 pr-2">
          <span>t = {useStudio.getState().simTime.toFixed(3)} s</span>
          <span>{nodes.length} blocks · {edges.length} wires</span>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: "240px 1fr 300px" }}>
        {/* Left: block library + explorer */}
        <div className="border-r border-slate-800 flex flex-col bg-[#0b1220]">
          <div className="border-b border-slate-800 px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400">
            Project Explorer
          </div>
          <ProjectExplorer />
          <div className="border-t border-b border-slate-800 px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400">
            Block Library
          </div>
          <div className="flex-1 min-h-0">
            <BlockLibraryPanel />
          </div>
        </div>

        {/* Center: canvas + scope */}
        <div className="grid overflow-hidden" style={{ gridTemplateRows: "1fr 260px" }}>
          <div className="border-b border-slate-800">
            <StudioCanvasWithProvider />
          </div>
          <div className="bg-[#0b1220]">
            <ScopePanel />
          </div>
        </div>

        {/* Right: inspector + console */}
        <div
          className="border-l border-slate-800 grid bg-[#0b1220]"
          style={{ gridTemplateRows: "1fr 240px" }}
        >
          <div className="overflow-hidden flex flex-col">
            <div className="border-b border-slate-800 px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400">
              Property Inspector
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <PropertyInspectorPanel />
            </div>
          </div>
          <div className="border-t border-slate-800 overflow-hidden">
            <ConsolePanel />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectExplorer() {
  const loadProject = useStudio((s) => s.loadProject);
  const recents = typeof window !== "undefined" ? getRecents() : [];
  return (
    <div className="text-xs max-h-40 overflow-auto">
      {recents.length === 0 && <div className="p-3 text-slate-600">No recent projects.</div>}
      {recents.map((r) => (
        <button
          key={r.name + r.ts}
          onClick={() => loadProject(r.project)}
          className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300"
        >
          <div className="truncate">{r.name}</div>
          <div className="text-[9px] text-slate-500">{new Date(r.ts).toLocaleString()}</div>
        </button>
      ))}
    </div>
  );
}
