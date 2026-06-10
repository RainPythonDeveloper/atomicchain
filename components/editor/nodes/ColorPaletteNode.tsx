"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Pipette } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const PRESETS = [
  { label: "Sunset",      colors: ["#FF6B35", "#F7931E", "#1A1A2E"] },
  { label: "Ocean",       colors: ["#0077B6", "#00B4D8", "#CAF0F8"] },
  { label: "Forest",      colors: ["#1B4332", "#40916C", "#D8F3DC"] },
  { label: "Noir",        colors: ["#1A1A1A", "#4A4A4A", "#E8E8E8"] },
  { label: "Neon Cyber",  colors: ["#0D0221", "#FF00FF", "#00FFFF"] },
  { label: "Volcanic",    colors: ["#1F1B1E", "#F04D07", "#891A06"] },
];

function hexToName(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 510;
  if (l < 0.12) return "deep black";
  if (l > 0.88) return "bright white";
  if (r > g && r > b) {
    if (g > 120) return l > 0.5 ? "warm orange" : "deep orange";
    return l > 0.4 ? "bright red" : "dark crimson";
  }
  if (g > r && g > b) return l > 0.5 ? "light green" : "deep forest green";
  if (b > r && b > g) return l > 0.5 ? "sky blue" : "deep navy blue";
  if (r > 140 && g > 140 && b < 80) return "golden yellow";
  if (r > 140 && b > 140 && g < 80) return "purple violet";
  if (g > 140 && b > 140 && r < 80) return "teal cyan";
  return l > 0.5 ? "light gray" : "dark gray";
}

function buildModifier(colors: string[]): string {
  const names = colors.map(hexToName).filter(Boolean);
  if (names.length === 0) return "";
  return `color palette featuring ${names.join(", ")}`;
}

export function ColorPaletteNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const colors = (data.colors as string[]) ?? ["#F04D07", "#1F1B1E", "#989999"];

  const setColor = (idx: number, val: string) => {
    const next = [...colors];
    next[idx] = val;
    updateNodeData(id, { colors: next, modifier: buildModifier(next) });
  };

  const applyPreset = (preset: string[]) => {
    updateNodeData(id, { colors: preset, modifier: buildModifier(preset) });
  };

  return (
    <div className="retro-node" style={{ width: 300 }}>
      <div className="retro-node-header node-drag-handle node-header-purple">
        <Pipette size={16} />
        <span>Color Palette</span>
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight />
      </div>
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Color pickers */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {colors.map((c, i) => (
            <label key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 8,
                background: c,
                border: "2px solid #5A3020",
                boxShadow: `0 3px 0 #0A0604, 0 0 10px ${c}60, inset 0 1px 0 rgba(255,255,255,0.15)`,
                position: "relative", overflow: "hidden",
              }}>
                <input
                  type="color"
                  value={c}
                  onChange={(e) => setColor(i, e.target.value)}
                  className="nodrag"
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    opacity: 0, cursor: "pointer", border: "none",
                  }}
                />
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#706060" }}>
                {c.toUpperCase()}
              </span>
            </label>
          ))}
        </div>

        {/* Presets */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#706060", marginBottom: 6 }}>PRESETS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.colors)}
                className="nodrag"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 8px", borderRadius: 6, cursor: "pointer",
                  background: "linear-gradient(180deg,#231A18 0%,#1C1614 100%)",
                  border: "1.5px solid #3A2218", borderBottomColor: "#150C0A",
                  transition: "all 0.1s",
                  boxShadow: "0 2px 0 #100806",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#6A3820"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#3A2218"; }}
              >
                <div style={{ display: "flex", gap: 2 }}>
                  {p.colors.map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                  ))}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#908080" }}>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview text */}
        <div style={{
          padding: "7px 10px", borderRadius: 6,
          background: "#180E0C", border: "1px solid rgba(147,51,234,0.2)",
          fontFamily: "var(--font-mono)", fontSize: "0.63rem", color: "#9B72D0",
        }}>
          {buildModifier(colors)}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="color-out"
        style={{ background: "#9333EA", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
