"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Layers } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

export function BatchNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const count = (data.count as number) ?? 2;

  return (
    <div className="retro-node" style={{ width: 240 }}>
      <div className="retro-node-header node-drag-handle node-header-lime">
        <Layers size={16} />
        <span>Batch Generate</span>
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight />
      </div>
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Count selector */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#706060", marginBottom: 8 }}>
            VARIATIONS
          </div>
          <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const active = count === n;
              return (
                <button
                  key={n}
                  onClick={() => updateNodeData(id, { count: n })}
                  className="nodrag"
                  style={{
                    width: 36, height: 36, borderRadius: 7, cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 800,
                    transition: "all 0.08s",
                    background: active
                      ? "linear-gradient(180deg, #6ECF20 0%, #4A9E0A 100%)"
                      : "linear-gradient(180deg,#2A1E18 0%,#221814 100%)",
                    border: `1.5px solid ${active ? "#3A7010" : "#3A2218"}`,
                    borderBottomColor: active ? "#1A4006" : "#150C0A",
                    color: active ? "#fff" : "#706060",
                    boxShadow: active
                      ? "0 3px 0 #1A4006,0 4px 0 1px #0A2002,0 0 12px rgba(101,163,13,0.3),inset 0 1px 0 rgba(255,255,255,0.2)"
                      : "0 3px 0 #100806,0 4px 0 1px #080402",
                    transform: active ? "translateY(0)" : "",
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div style={{
          padding: "10px 12px", borderRadius: 7,
          background: "#180E0C", border: "1px solid rgba(101,163,13,0.2)",
          fontFamily: "var(--font-mono)", fontSize: "0.65rem",
          color: "#7CA830", lineHeight: 1.6,
        }}>
          Will generate <strong style={{ color: "#A3E635" }}>{count}</strong> variation{count > 1 ? "s" : ""}.
          {count > 1 && <><br />All saved to gallery.</>}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="batch-out"
        style={{ background: "#65A30D", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
