"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { RectangleHorizontal } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const RATIOS = [
  { label: "1:1",     icon: "⬛", value: "square",    size: "1024x1024", prompt: "square composition" },
  { label: "4:5",     icon: "▬",  value: "portrait45", size: "896x1024",  prompt: "portrait orientation, 4:5 ratio" },
  { label: "9:16",    icon: "▮",  value: "portrait916",size: "576x1024",  prompt: "vertical portrait, 9:16, mobile format" },
  { label: "4:3",     icon: "▭",  value: "land43",     size: "1024x768",  prompt: "landscape, 4:3 ratio" },
  { label: "16:9",    icon: "━",  value: "land169",    size: "1024x576",  prompt: "widescreen landscape, 16:9" },
  { label: "2.39:1",  icon: "▬",  value: "cinema",     size: "1024x428",  prompt: "cinematic widescreen, anamorphic, letterbox" },
];

export function AspectRatioNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const selected = (data.ratio as string) ?? "square";

  return (
    <div className="retro-node" style={{ width: 280 }}>
      <div className="retro-node-header node-drag-handle node-header-sky">
        <RectangleHorizontal size={16} />
        <span>Aspect Ratio</span>
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight />
      </div>
      <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {RATIOS.map((r) => {
          const active = selected === r.value;
          return (
            <button
              key={r.value}
              onClick={() => updateNodeData(id, { ratio: r.value, size: r.size, prompt: r.prompt })}
              className="nodrag"
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "10px 8px", gap: 4, borderRadius: 8, cursor: "pointer",
                fontFamily: "var(--font-mono)", transition: "all 0.1s ease",
                background: active
                  ? "linear-gradient(180deg,rgba(14,165,233,0.22) 0%,rgba(8,116,165,0.14) 100%)"
                  : "linear-gradient(180deg,#231A18 0%,#1C1614 100%)",
                border: `1.5px solid ${active ? "rgba(14,165,233,0.5)" : "#3A2218"}`,
                borderBottomColor: active ? "rgba(4,70,110,0.6)" : "#150C0A",
                color: active ? "#38BDF8" : "#706060",
                boxShadow: active ? "0 2px 0 #041626,0 0 12px rgba(14,165,233,0.15),inset 0 1px 0 rgba(56,189,248,0.1)" : "0 2px 0 #100806",
              }}
            >
              <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{r.icon}</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em" }}>{r.label}</span>
            </button>
          );
        })}
      </div>
      <Handle type="source" position={Position.Right} id="aspect-out"
        style={{ background: "#0EA5E9", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
