"use client";

import { Handle, Position, type NodeProps, useHandleConnections, useNodesData } from "@xyflow/react";
import { GitMerge } from "lucide-react";
import { useEffect } from "react";
import { useAtomicStore } from "@/lib/store";

export function CombinerNode({ id }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const connections = useHandleConnections({ type: "target" });
  const connectedIds = connections.map((c) => c.source);
  const nodesData = useNodesData(connectedIds);

  useEffect(() => {
    const parts = nodesData
      .map((n) => (n?.data?.prompt as string) ?? "")
      .filter(Boolean);
    updateNodeData(id, { combined: parts.join(", ") });
  }, [nodesData, id, updateNodeData]);

  return (
    <div className="retro-node" style={{ width: 270 }}>
      <div className="retro-node-header node-drag-handle node-header-gold">
        <GitMerge size={16} />
        <span>Combiner</span>
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          color: connections.length > 0 ? "#E0B030" : "#504040",
          padding: "12px 14px",
          borderRadius: 7,
          background: "#180E0C",
          border: `1.5px solid ${connections.length > 0 ? "rgba(200,144,0,0.3)" : "#3A2218"}`,
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}>
          {connections.length === 0 ? "← Connect prompt nodes" : `${connections.length} prompt(s) fused`}
        </div>
      </div>
      <Handle type="target" position={Position.Left}  id="a-in"         style={{ top: "38%", background: "#C89000", width: 16, height: 16 }} />
      <Handle type="target" position={Position.Left}  id="b-in"         style={{ top: "62%", background: "#C89000", width: 16, height: 16 }} />
      <Handle type="source" position={Position.Right} id="combined-out" style={{ top: "50%", background: "#C89000", width: 16, height: 16 }} />
    </div>
  );
}
