"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Hourglass } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const ERAS = [
  { label: "Prehistoric",  year: "10000 BC", value: "prehistoric era, dinosaurs, primal jungle, volcanic landscape" },
  { label: "Ancient Egypt", year: "2500 BC", value: "ancient Egypt, pyramids, hieroglyphs, golden sand, pharaoh aesthetics" },
  { label: "Medieval",      year: "1300",    value: "medieval times, castles, knights, torchlight, gothic architecture" },
  { label: "Renaissance",   year: "1500",    value: "renaissance era, ornate architecture, classical painting aesthetics" },
  { label: "Victorian",     year: "1880",    value: "victorian era, steampunk machinery, gas lamps, brass and leather" },
  { label: "Roaring 20s",   year: "1925",    value: "1920s art deco, jazz age, vintage sepia photograph, gatsby glamour" },
  { label: "Neon 80s",      year: "1985",    value: "1980s retrowave, neon grids, synthwave, VHS aesthetic, chrome" },
  { label: "Present Day",   year: "2026",    value: "modern day, contemporary urban setting, photojournalism style" },
  { label: "Near Future",   year: "2200",    value: "futuristic cyberpunk city, holograms, flying vehicles, neon rain" },
  { label: "Far Future",    year: "3000",    value: "distant future, post-human civilization, megastructures, dyson sphere" },
];

export function TimeMachineNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const era = (data.era as string) ?? "";

  const select = (value: string) => {
    const next = era === value ? "" : value;
    updateNodeData(id, { era: next, modifier: next });
  };

  return (
    <div className="retro-node" style={{ width: 300 }}>
      <div className="retro-node-header node-drag-handle node-header-bronze">
        <Hourglass size={16} />
        <span>Time Machine</span>
        {era && (
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#E0995A" }}>
            {ERAS.find((e) => e.value === era)?.year}
          </span>
        )}
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight={!era} />
      </div>

      <div style={{ padding: "12px 12px 12px 8px", display: "flex", flexDirection: "column" }}>
        {ERAS.map((e, i) => {
          const active = era === e.value;
          const isLast = i === ERAS.length - 1;
          return (
            <div key={e.value} style={{ display: "flex", gap: 9 }}>
              {/* Timeline rail */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14, flexShrink: 0 }}>
                <div style={{
                  width: active ? 11 : 7, height: active ? 11 : 7, borderRadius: "50%",
                  marginTop: 9, flexShrink: 0,
                  background: active ? "#E0995A" : "#4A3020",
                  border: `1.5px solid ${active ? "#F5C08A" : "#5A4030"}`,
                  boxShadow: active ? "0 0 8px rgba(224,153,90,0.8)" : "none",
                  transition: "all 0.15s",
                }} />
                {!isLast && (
                  <div style={{ width: 1.5, flex: 1, background: "linear-gradient(180deg, #4A3020, #3A2418)", minHeight: 10 }} />
                )}
              </div>

              <button
                onClick={() => select(e.value)}
                className="nodrag"
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 10px", marginBottom: 4, borderRadius: 6, cursor: "pointer",
                  fontFamily: "var(--font-mono)", fontSize: "0.68rem", textAlign: "left",
                  transition: "all 0.1s",
                  background: active
                    ? "linear-gradient(180deg, rgba(194,112,45,0.25) 0%, rgba(130,70,25,0.16) 100%)"
                    : "transparent",
                  border: `1.5px solid ${active ? "rgba(194,112,45,0.5)" : "transparent"}`,
                  color: active ? "#E0995A" : "#706060",
                  boxShadow: active ? "0 2px 0 #2A1808, 0 0 10px rgba(194,112,45,0.15)" : "none",
                }}
              >
                <span>{e.label}</span>
                <span style={{ fontSize: "0.58rem", opacity: 0.7 }}>{e.year}</span>
              </button>
            </div>
          );
        })}
      </div>

      <Handle type="source" position={Position.Right} id="era-out"
        style={{ background: "#C2702D", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
