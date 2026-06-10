"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { CloudSun } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const TIMES = [
  { label: "Dawn",        value: "at dawn, first light, sunrise" },
  { label: "Morning",     value: "morning light, fresh morning" },
  { label: "Golden Hour", value: "golden hour lighting, warm afternoon sun" },
  { label: "Midday",      value: "harsh midday sun, bright daylight" },
  { label: "Dusk",        value: "dusk, twilight, sunset glow" },
  { label: "Blue Hour",   value: "blue hour, magical twilight" },
  { label: "Midnight",    value: "midnight, deep night atmosphere" },
];

const WEATHER = [
  { label: "Clear",   value: "clear sky, crisp atmosphere" },
  { label: "Foggy",   value: "thick fog, misty atmosphere" },
  { label: "Rainy",   value: "rain, wet surfaces, puddles reflecting light" },
  { label: "Stormy",  value: "dramatic storm clouds, lightning in distance" },
  { label: "Snowy",   value: "snowfall, snow-covered, winter atmosphere" },
  { label: "Hazy",    value: "hazy atmosphere, heat shimmer, dusty air" },
];

const VIBES = [
  { label: "Cinematic",    value: "cinematic atmosphere, movie scene" },
  { label: "Dreamy",       value: "dreamlike, soft, ethereal quality" },
  { label: "Dark & Moody", value: "dark moody atmosphere, shadows, tension" },
  { label: "Epic",         value: "epic scale, dramatic, awe-inspiring" },
  { label: "Mysterious",   value: "mysterious, enigmatic atmosphere" },
  { label: "Cozy",         value: "warm cozy atmosphere, comfortable, inviting" },
  { label: "Melancholic",  value: "melancholic, nostalgic, bittersweet mood" },
  { label: "Vibrant",      value: "vibrant, energetic, colorful atmosphere" },
];

function BtnGrid({ items, selected, onSelect, color }: { items: { label: string; value: string }[]; selected: string; onSelect: (v: string) => void; color: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {items.map((item) => {
        const active = selected === item.value;
        return (
          <button
            key={item.value}
            onClick={() => onSelect(active ? "" : item.value)}
            className="nodrag"
            style={{
              padding: "5px 10px", borderRadius: 5, cursor: "pointer",
              fontFamily: "var(--font-mono)", fontSize: "0.65rem",
              transition: "all 0.1s",
              background: active ? `linear-gradient(180deg,${color}30 0%,${color}18 100%)` : "linear-gradient(180deg,#231A18 0%,#1C1614 100%)",
              border: `1.5px solid ${active ? color + "50" : "#3A2218"}`,
              color: active ? color : "#706060",
              boxShadow: active ? `0 2px 0 #0A0806,0 0 8px ${color}20` : "0 2px 0 #100806",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function MoodNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const time    = (data.time    as string) ?? "";
  const weather = (data.weather as string) ?? "";
  const vibe    = (data.vibe    as string) ?? "";

  const buildModifier = (t: string, w: string, v: string) =>
    [t, w, v].filter(Boolean).join(", ");

  const set = (key: string, val: string) => {
    const updated = { time, weather, vibe, [key]: val };
    updateNodeData(id, { ...updated, modifier: buildModifier(updated.time, updated.weather, updated.vibe) });
  };

  const preview = buildModifier(time, weather, vibe);

  return (
    <div className="retro-node" style={{ width: 360 }}>
      <div className="retro-node-header node-drag-handle node-header-indigo">
        <CloudSun size={16} />
        <span>Mood & Atmosphere</span>
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight />
      </div>
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#706060", marginBottom: 5 }}>TIME OF DAY</div>
          <BtnGrid items={TIMES} selected={time} onSelect={(v) => set("time", v)} color="#A5B4FC" />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#706060", marginBottom: 5 }}>WEATHER</div>
          <BtnGrid items={WEATHER} selected={weather} onSelect={(v) => set("weather", v)} color="#A5B4FC" />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#706060", marginBottom: 5 }}>VIBE</div>
          <BtnGrid items={VIBES} selected={vibe} onSelect={(v) => set("vibe", v)} color="#A5B4FC" />
        </div>
        {preview && (
          <div style={{ padding: "8px 10px", borderRadius: 6, background: "#180E0C", border: "1px solid rgba(99,102,241,0.22)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#8B8FD8", lineHeight: 1.5 }}>
            {preview}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} id="mood-out"
        style={{ background: "#6366F1", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
