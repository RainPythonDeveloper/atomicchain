"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Sun } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const LIGHTING: Record<string, { label: string; value: string }[]> = {
  Natural: [
    { label: "Golden Hour",  value: "golden hour sunlight, warm directional light" },
    { label: "Blue Hour",    value: "blue hour ambient light, cool tones" },
    { label: "Overcast",     value: "overcast diffused light, no harsh shadows" },
    { label: "Harsh Sun",    value: "harsh noon sunlight, high contrast shadows" },
    { label: "Backlit",      value: "backlit, rim lighting, silhouette effect" },
  ],
  Studio: [
    { label: "Soft Box",     value: "studio soft box lighting, even diffused light" },
    { label: "Rembrandt",    value: "rembrandt lighting, dramatic triangle shadow" },
    { label: "Butterfly",    value: "butterfly lighting, glamour portrait lighting" },
    { label: "Split",        value: "split lighting, half lit half shadow" },
    { label: "Rim Light",    value: "rim light, edge lighting, separation light" },
  ],
  Dramatic: [
    { label: "Candlelight",  value: "candlelight, warm flickering flame glow" },
    { label: "Neon Glow",    value: "neon light glow, cyberpunk colored lighting" },
    { label: "Firelight",    value: "firelight, campfire warm orange glow" },
    { label: "Moonlight",    value: "moonlight, cool silver night illumination" },
    { label: "Bioluminescent",value: "bioluminescent light, glowing organisms" },
  ],
  Cinematic: [
    { label: "Motivated",    value: "motivated lighting, cinematic key light" },
    { label: "High Key",     value: "high key lighting, bright airy atmosphere" },
    { label: "Low Key",      value: "low key lighting, noir dark shadows" },
    { label: "Volumetric",   value: "volumetric light rays, god rays through fog" },
    { label: "Lens Flare",   value: "beautiful lens flare, anamorphic flare" },
  ],
};

const CATS = Object.keys(LIGHTING);

export function LightingNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const selected = (data.lighting as string) ?? "";
  const activeCategory = (data.category as string) ?? "Natural";

  return (
    <div className="retro-node" style={{ width: 320 }}>
      <div className="retro-node-header node-drag-handle node-header-warm">
        <Sun size={16} />
        <span>Lighting</span>
        {selected && (
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#FCA57A" }}>
            {LIGHTING[activeCategory]?.find(l => l.value === selected)?.label ?? "custom"}
          </span>
        )}
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight={!selected} />
      </div>
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Category tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => updateNodeData(id, { category: cat })}
              className="nodrag"
              style={{
                flex: 1, padding: "5px 4px", borderRadius: 5, cursor: "pointer",
                fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700,
                transition: "all 0.1s",
                background: activeCategory === cat
                  ? "linear-gradient(180deg,rgba(251,146,60,0.22) 0%,rgba(194,100,30,0.14) 100%)"
                  : "linear-gradient(180deg,#231A18 0%,#1C1614 100%)",
                border: `1.5px solid ${activeCategory === cat ? "rgba(251,146,60,0.5)" : "#3A2218"}`,
                color: activeCategory === cat ? "#FCA57A" : "#706060",
                boxShadow: activeCategory === cat ? "0 2px 0 #3A1400,inset 0 1px 0 rgba(252,165,122,0.1)" : "0 2px 0 #100806",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lighting options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {(LIGHTING[activeCategory] ?? []).map((l) => {
            const active = selected === l.value;
            return (
              <button
                key={l.value}
                onClick={() => updateNodeData(id, { lighting: active ? "" : l.value, modifier: active ? "" : l.value })}
                className="nodrag"
                style={{
                  padding: "8px 12px", borderRadius: 6, cursor: "pointer",
                  fontFamily: "var(--font-mono)", fontSize: "0.72rem",
                  textAlign: "left", transition: "all 0.1s",
                  background: active
                    ? "linear-gradient(180deg,rgba(251,146,60,0.22) 0%,rgba(194,100,30,0.14) 100%)"
                    : "linear-gradient(180deg,#231A18 0%,#1C1614 100%)",
                  border: `1.5px solid ${active ? "rgba(251,146,60,0.45)" : "#3A2218"}`,
                  color: active ? "#FCA57A" : "#706060",
                  boxShadow: active ? "0 2px 0 #3A1400,0 0 10px rgba(251,146,60,0.14),inset 0 1px 0 rgba(252,165,122,0.08)" : "0 2px 0 #100806",
                }}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="lighting-out"
        style={{ background: "#FB923C", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
