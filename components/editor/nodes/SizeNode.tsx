"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Expand } from "lucide-react";

const SIZES = [
  { label: "256 × 256",   value: "256x256",   tag: "Tiny" },
  { label: "512 × 512",   value: "512x512",   tag: "Small" },
  { label: "768 × 768",   value: "768x768",   tag: "Medium" },
  { label: "1024 × 1024", value: "1024x1024", tag: "Max" },
];

export function SizeNode({ id, data }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const size = (data.size as string) ?? "1024x1024";

  return (
    <div className="retro-node" style={{ width: 300 }}>
      <div className="retro-node-header node-drag-handle node-header-teal">
        <Expand size={16} />
        <span>Size</span>
      </div>
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 6 }}>
        {SIZES.map((s) => {
          const active = size === s.value;
          return (
            <button
              key={s.value}
              onClick={() => updateNodeData(id, { size: s.value })}
              className="nodrag"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: 7,
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.1s ease",
                background: active
                  ? "linear-gradient(180deg, rgba(10,158,138,0.22) 0%, rgba(6,110,95,0.15) 100%)"
                  : "linear-gradient(180deg, #231A18 0%, #1C1614 100%)",
                border: `1.5px solid ${active ? "rgba(10,158,138,0.5)" : "#3A2218"}`,
                borderBottomColor: active ? "rgba(4,80,70,0.6)" : "#150C0A",
                color: active ? "#40C8B8" : "#706060",
                boxShadow: active
                  ? "0 2px 0 #041A16, 0 0 12px rgba(10,158,138,0.14), inset 0 1px 0 rgba(40,200,180,0.1)"
                  : "0 2px 0 #100806, inset 0 1px 0 rgba(40,200,180,0.03)",
              }}
            >
              <span>{s.label}</span>
              <span style={{
                fontSize: "0.68rem",
                padding: "2px 8px",
                borderRadius: 4,
                background: active ? "rgba(10,158,138,0.25)" : "#2A1A16",
                border: `1px solid ${active ? "rgba(10,158,138,0.4)" : "#3A2218"}`,
                color: active ? "#30B0A0" : "#504040",
              }}>
                {s.tag}
              </span>
            </button>
          );
        })}
      </div>
      <Handle type="source" position={Position.Right} id="size-out"
        style={{ background: "#0A9E8A", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
