"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ConnectionLineType,
  ConnectionMode,
  type ConnectionLineComponentProps,
  getBezierPath,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAtomicStore } from "@/lib/store";
import { SIDEBAR_NODE_TYPES } from "./NodeSidebar";
import { PromptNode } from "./nodes/PromptNode";
import { NegativeNode } from "./nodes/NegativeNode";
import { SizeNode } from "./nodes/SizeNode";
import { StyleNode } from "./nodes/StyleNode";
import { CombinerNode } from "./nodes/CombinerNode";
import { GenerateNode } from "./nodes/GenerateNode";
import { OutputNode } from "./nodes/OutputNode";
import { RefineNode } from "./nodes/RefineNode";

const NODE_TYPES = {
  promptNode: PromptNode,
  negativeNode: NegativeNode,
  sizeNode: SizeNode,
  styleNode: StyleNode,
  combinerNode: CombinerNode,
  generateNode: GenerateNode,
  outputNode: OutputNode,
  refineNode: RefineNode,
};

// Smooth animated connection line while dragging
function CustomConnectionLine({
  fromX, fromY, toX, toY, fromPosition, toPosition,
}: ConnectionLineComponentProps) {
  const [path] = getBezierPath({ sourceX: fromX, sourceY: fromY, sourcePosition: fromPosition, targetX: toX, targetY: toY, targetPosition: toPosition });
  return (
    <g>
      <path
        fill="none"
        stroke="#6e56cf"
        strokeWidth={2}
        strokeDasharray="6 3"
        d={path}
        style={{ filter: "drop-shadow(0 0 4px rgba(110,86,207,0.6))" }}
      />
      <circle cx={toX} cy={toY} r={5} fill="#6e56cf" opacity={0.8} />
    </g>
  );
}

const DEFAULT_EDGE_OPTIONS = {
  type: "smoothstep" as const,
  animated: true,
  style: { stroke: "#6e56cf", strokeWidth: 2 },
};

function NodeCanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useAtomicStore();
  const nodeTypes = useMemo(() => NODE_TYPES, []);
  const { screenToFlowPosition } = useReactFlow();

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      useAtomicStore.getState().runWorkflow();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      useAtomicStore.getState().saveWorkflow();
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData("application/atomicchain-node");
    if (!nodeType) return;
    const nodeDef = SIDEBAR_NODE_TYPES.find((n) => n.type === nodeType);
    if (!nodeDef) return;
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    addNode(nodeType, nodeDef.defaultData as Record<string, unknown>, position);
  }, [screenToFlowPosition, addNode]);

  return (
    <div className="flex-1 relative" onKeyDown={onKeyDown} tabIndex={0} style={{ outline: "none" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        // Connections
        connectionLineType={ConnectionLineType.Bezier}
        connectionLineComponent={CustomConnectionLine}
        connectionMode={ConnectionMode.Loose}
        connectionRadius={40}
        // Edges
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        // Viewport
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.15}
        maxZoom={2.5}
        // Performance
        onlyRenderVisibleElements={false}
        style={{ background: "#0a0a0f" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#1e1e2e"
        />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          position="bottom-left"
          nodeColor={() => "#6e56cf"}
          maskColor="rgba(10,10,15,0.8)"
          style={{ background: "#13131a", border: "1px solid #1e1e2e" }}
        />
      </ReactFlow>

      <div className="absolute top-3 right-3 flex gap-2 pointer-events-none">
        <span className="text-[10px] text-[#6b6b80] bg-[#13131a] border border-[#1e1e2e] px-2 py-1 rounded">
          ⌘+Enter to run · ⌘+S to save
        </span>
      </div>
    </div>
  );
}

export function NodeCanvas() {
  return (
    <ReactFlowProvider>
      <NodeCanvasInner />
    </ReactFlowProvider>
  );
}
