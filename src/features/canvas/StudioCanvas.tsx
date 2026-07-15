"use client";
import { useCallback, useMemo, useRef } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Handle,
  Position,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useStudio, type BlockNode } from "../store/studio-store";
import { getBlockDef } from "../blocks/registry";

function BlockNodeView({ id, data, selected }: NodeProps<BlockNode>) {
  const def = getBlockDef(data.blockType);
  const rotate = useStudio((s) => s.rotateNode);
  if (!def) return <div className="text-xs text-red-400">Unknown block</div>;
  return (
    <div
      className={`rounded-lg border bg-[#0b1220] text-slate-100 shadow-lg transition ${
        selected ? "border-sky-400 shadow-sky-400/30" : "border-slate-700"
      }`}
      style={{ transform: `rotate(${data.rotation}deg)`, minWidth: 140 }}
      onDoubleClick={() => rotate(id)}
    >
      <div
        className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-t-lg"
        style={{ background: def.color + "22", color: def.color }}
      >
        {data.label}
      </div>
      <div className="px-3 py-2 text-[10px] text-slate-400">{def.description}</div>
      {def.inputs.map((p, i) => (
        <Handle
          key={"in" + p.id}
          type="target"
          position={Position.Left}
          id={p.id}
          style={{ top: 32 + i * 16, background: "#38bdf8" }}
        />
      ))}
      {def.outputs.map((p, i) => (
        <Handle
          key={"out" + p.id}
          type="source"
          position={Position.Right}
          id={p.id}
          style={{ top: 32 + i * 16, background: "#22c55e" }}
        />
      ))}
    </div>
  );
}

const nodeTypes = { block: BlockNodeView };

export function StudioCanvas() {
  const nodes = useStudio((s) => s.nodes);
  const edges = useStudio((s) => s.edges);
  const setNodes = useStudio((s) => s.setNodes);
  const setEdges = useStudio((s) => s.setEdges);
  const addBlock = useStudio((s) => s.addBlock);
  const setSelection = useStudio((s) => s.setSelection);
  const gridSnap = useStudio((s) => s.gridSnap);
  const showGrid = useStudio((s) => s.showGrid);
  const wrapper = useRef<HTMLDivElement>(null);

  const onNodesChange = useCallback(
    (c: NodeChange[]) => setNodes((n) => applyNodeChanges(c, n) as BlockNode[]),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (c: EdgeChange[]) => setEdges((e) => applyEdgeChanges(c, e)),
    [setEdges],
  );
  const onConnect = useCallback(
    (c: Connection) =>
      setEdges((e) =>
        addEdge({ ...c, animated: true, style: { stroke: "#38bdf8", strokeWidth: 2 } } as Edge, e),
      ),
    [setEdges],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/truhub-block");
      if (!type || !wrapper.current) return;
      const bounds = wrapper.current.getBoundingClientRect();
      addBlock(type, { x: event.clientX - bounds.left - 60, y: event.clientY - bounds.top - 30 });
    },
    [addBlock],
  );

  const snapProps = useMemo(
    () => (gridSnap ? { snapToGrid: true as const, snapGrid: [16, 16] as [number, number] } : {}),
    [gridSnap],
  );

  return (
    <div
      ref={wrapper}
      className="h-full w-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onSelectionChange={({ nodes: sn }) => setSelection(sn.map((n) => n.id))}
        fitView
        proOptions={{ hideAttribution: true }}
        {...snapProps}
      >
        {showGrid && <Background color="#1f2937" gap={16} />}
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => getBlockDef((n.data as BlockNode["data"])?.blockType)?.color ?? "#38bdf8"}
          maskColor="rgba(3,7,18,0.7)"
          style={{ background: "#0b1220", border: "1px solid #1f2937" }}
        />
        <Controls style={{ background: "#0b1220", border: "1px solid #1f2937" }} />
      </ReactFlow>
    </div>
  );
}

export function StudioCanvasWithProvider() {
  return (
    <ReactFlowProvider>
      <StudioCanvas />
    </ReactFlowProvider>
  );
}
