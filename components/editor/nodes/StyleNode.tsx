"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Palette } from "lucide-react";

const STYLES = [
  { label: "Realistic",  value: "photorealistic, 8k, detailed" },
  { label: "Anime",      value: "anime style, vibrant colors, manga" },
  { label: "Oil Paint",  value: "oil painting, artistic, textured brushstrokes" },
  { label: "Cyberpunk",  value: "cyberpunk, neon lights, dystopian, futuristic" },
  { label: "Watercolor", value: "watercolor painting, soft, flowing colors" },
  { label: "Sketch",     value: "pencil sketch, hand drawn, monochrome" },
  { label: "Fantasy",    value: "fantasy art, magical, ethereal, epic" },
  { label: "Minimal",    value: "minimalist, clean, simple composition" },
];

export function StyleNode({ id, data }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const selected = (data.styleModifier as string) ?? "";

  return (
    <div className="retro-node" style={{ width: 300 }}>
      <div className="retro-node-header node-drag-handle node-header-violet">
        <Palette size={16} />
        <span>Style</span>
      </div>
      <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {STYLES.map((s) => {
          const active = selected === s.value;
          return (
            <button
              key={s.value}
              onClick={() => updateNodeData(id, { styleModifier: active ? "" : s.value })}
              className="nodrag"
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.1s ease",
                textAlign: "center",
                background: active
                  ? "linear-gradient(180deg, rgba(138,63,208,0.25) 0%, rgba(95,38,160,0.16) 100%)"
                  : "linear-gradient(180deg, #231A18 0%, #1C1614 100%)",
                border: `1.5px solid ${active ? "rgba(138,63,208,0.45)" : "#3A2218"}`,
                borderBottomColor: active ? "rgba(60,18,100,0.6)" : "#150C0A",
                color: active ? "#B078F0" : "#706060",
                boxShadow: active
                  ? "0 2px 0 #1E0840, 0 0 10px rgba(138,63,208,0.18), inset 0 1px 0 rgba(180,100,255,0.1)"
                  : "0 2px 0 #100806",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <Handle type="source" position={Position.Right} id="style-out"
        style={{ background: "#8A3FD0", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
