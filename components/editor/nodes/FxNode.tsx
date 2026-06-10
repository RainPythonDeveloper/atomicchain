"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Wand2 } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const EFFECTS = [
  { label: "Hologram",       emoji: "👻", value: "holographic projection effect, translucent blue glow, scan lines" },
  { label: "Glitch",         emoji: "📺", value: "glitch art, digital distortion, chromatic aberration, datamosh" },
  { label: "Double Expo",    emoji: "🎞️", value: "double exposure effect, two scenes blended in silhouette" },
  { label: "Tilt-Shift",     emoji: "🔬", value: "tilt-shift photography, miniature world effect, shallow depth" },
  { label: "Long Expo",      emoji: "🌃", value: "long exposure photography, motion light trails" },
  { label: "X-Ray",          emoji: "🩻", value: "x-ray scan aesthetic, translucent inner structures, monochrome blue" },
  { label: "Thermal",        emoji: "🌡️", value: "thermal vision, infrared heatmap colors, predator view" },
  { label: "Pixel Art",      emoji: "👾", value: "retro pixel art, 16-bit videogame sprite style" },
  { label: "Low Poly",       emoji: "📐", value: "low poly 3D render, faceted geometric surfaces" },
  { label: "Vaporwave",      emoji: "🌴", value: "vaporwave aesthetic, pink-purple gradient, greek statues, grid floor" },
  { label: "Underwater",     emoji: "🌊", value: "underwater scene, light rays through water, floating bubbles" },
  { label: "Paint Burst",    emoji: "🎨", value: "explosion of colorful paint splashes frozen mid-air, high speed photo" },
];

const MAX_FX = 3;

export function FxNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const effects = (data.effects as string[]) ?? [];

  const toggle = (value: string) => {
    const next = effects.includes(value)
      ? effects.filter((e) => e !== value)
      : effects.length >= MAX_FX
        ? effects
        : [...effects, value];
    updateNodeData(id, { effects: next, modifier: next.join(", ") });
  };

  return (
    <div className="retro-node" style={{ width: 340 }}>
      <div className="retro-node-header node-drag-handle node-header-acid">
        <Wand2 size={16} />
        <span>Special FX</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: effects.length > 0 ? "#BBF34A" : "#504040" }}>
          {effects.length}/{MAX_FX}
        </span>
        <NodeDeleteButton id={id} show={!!isNodeSelected} />
      </div>

      <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
        {EFFECTS.map((fx) => {
          const active = effects.includes(fx.value);
          const disabled = !active && effects.length >= MAX_FX;
          return (
            <button
              key={fx.value}
              onClick={() => toggle(fx.value)}
              className="nodrag"
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "9px 4px", borderRadius: 7,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.35 : 1,
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                transition: "all 0.1s",
                background: active
                  ? "linear-gradient(180deg, rgba(158,240,26,0.2) 0%, rgba(100,160,15,0.13) 100%)"
                  : "linear-gradient(180deg, #231A18 0%, #1C1614 100%)",
                border: `1.5px solid ${active ? "rgba(158,240,26,0.5)" : "#3A2218"}`,
                borderBottomColor: active ? "rgba(70,110,10,0.6)" : "#150C0A",
                color: active ? "#BBF34A" : "#706060",
                boxShadow: active
                  ? "0 2px 0 #1A2A04, 0 0 10px rgba(158,240,26,0.15), inset 0 1px 0 rgba(187,243,74,0.1)"
                  : "0 2px 0 #100806",
              }}
            >
              <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>{fx.emoji}</span>
              {fx.label}
            </button>
          );
        })}
      </div>

      {effects.length > 0 && (
        <div style={{ padding: "0 12px 12px" }}>
          <div style={{
            padding: "7px 10px", borderRadius: 6,
            background: "#180E0C", border: "1px solid rgba(158,240,26,0.2)",
            fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#8AB830", lineHeight: 1.5,
          }}>
            {effects.map((e) => EFFECTS.find((fx) => fx.value === e)?.label).join(" + ")}
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Right} id="fx-out"
        style={{ background: "#9EF01A", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
