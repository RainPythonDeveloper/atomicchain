"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Gem } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const MATERIALS = [
  { label: "Glass",     emoji: "🫧", value: "made entirely of translucent glass, light refractions, caustics" },
  { label: "Origami",   emoji: "📐", value: "made of folded origami paper, crisp paper folds, papercraft" },
  { label: "LEGO",      emoji: "🧱", value: "built from LEGO bricks, plastic studs, toy photography" },
  { label: "Chocolate", emoji: "🍫", value: "sculpted from melting chocolate, glossy cocoa texture" },
  { label: "Crystal",   emoji: "💎", value: "carved from glowing crystal, faceted gemstone surfaces" },
  { label: "Neon",      emoji: "✨", value: "formed from neon light tubes, glowing wireframe, dark background" },
  { label: "Ice",       emoji: "🧊", value: "frozen in clear ice, frost details, subzero atmosphere" },
  { label: "Gold",      emoji: "🏆", value: "cast in polished gold, ornate baroque metalwork" },
  { label: "Clouds",    emoji: "☁️", value: "formed from soft volumetric clouds, fluffy dreamlike shapes" },
  { label: "Wood",      emoji: "🪵", value: "hand-carved from wood, visible grain, artisan woodwork" },
  { label: "Knitted",   emoji: "🧶", value: "knitted from soft wool yarn, cozy fabric texture, handmade" },
  { label: "Liquid",    emoji: "💧", value: "made of flowing liquid metal, chrome splashes frozen in time" },
];

export function MaterialNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const material = (data.material as string) ?? "";

  const select = (value: string) => {
    const next = material === value ? "" : value;
    updateNodeData(id, { material: next, modifier: next });
  };

  return (
    <div className="retro-node" style={{ width: 330 }}>
      <div className="retro-node-header node-drag-handle node-header-mint">
        <Gem size={16} />
        <span>Made Of…</span>
        {material && (
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#7DEFD8" }}>
            {MATERIALS.find((m) => m.value === material)?.label}
          </span>
        )}
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight={!material} />
      </div>

      <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
        {MATERIALS.map((m) => {
          const active = material === m.value;
          return (
            <button
              key={m.value}
              onClick={() => select(m.value)}
              className="nodrag"
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "9px 4px", borderRadius: 7, cursor: "pointer",
                fontFamily: "var(--font-mono)", fontSize: "0.62rem",
                transition: "all 0.1s",
                background: active
                  ? "linear-gradient(180deg, rgba(94,234,212,0.22) 0%, rgba(40,150,130,0.14) 100%)"
                  : "linear-gradient(180deg, #231A18 0%, #1C1614 100%)",
                border: `1.5px solid ${active ? "rgba(94,234,212,0.5)" : "#3A2218"}`,
                borderBottomColor: active ? "rgba(20,90,75,0.6)" : "#150C0A",
                color: active ? "#7DEFD8" : "#706060",
                boxShadow: active
                  ? "0 2px 0 #042A22, 0 0 10px rgba(94,234,212,0.15), inset 0 1px 0 rgba(125,239,216,0.1)"
                  : "0 2px 0 #100806",
              }}
            >
              <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>{m.emoji}</span>
              {m.label}
            </button>
          );
        })}
      </div>

      <Handle type="source" position={Position.Right} id="material-out"
        style={{ background: "#5EEAD4", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
