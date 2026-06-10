"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { PenLine } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const ARTISTS = [
  { label: "Van Gogh",      value: "in the style of Vincent van Gogh, impressionist swirls, vivid colors",       era: "Classic" },
  { label: "Monet",         value: "in the style of Claude Monet, soft impressionist brushwork, pastel palette", era: "Classic" },
  { label: "Da Vinci",      value: "in the style of Leonardo da Vinci, renaissance art, sfumato technique",      era: "Classic" },
  { label: "Rembrandt",     value: "in the style of Rembrandt, dramatic chiaroscuro, golden baroque lighting",   era: "Classic" },
  { label: "Klimt",         value: "in the style of Gustav Klimt, ornate gold patterns, art nouveau",            era: "Classic" },
  { label: "Dalí",          value: "in the style of Salvador Dalí, surrealist dreamscape, melting reality",      era: "Modern" },
  { label: "Banksy",        value: "in the style of Banksy, urban street art, stencil graffiti, political",      era: "Modern" },
  { label: "Beksiński",     value: "in the style of Zdzisław Beksiński, dystopian horror, dark surrealism",      era: "Modern" },
  { label: "Mucha",         value: "in the style of Alphonse Mucha, art nouveau poster, decorative florals",     era: "Modern" },
  { label: "Frazetta",      value: "in the style of Frank Frazetta, epic fantasy illustration, heroic realism",  era: "Fantasy" },
  { label: "Ghibli",        value: "Studio Ghibli style, hand-drawn animation, soft watercolor, magical",        era: "Fantasy" },
  { label: "Rutkowski",     value: "Greg Rutkowski style, epic fantasy digital art, volumetric lighting",        era: "Digital" },
  { label: "Beeple",        value: "Beeple style, dystopian digital art, cinematic 3D render",                   era: "Digital" },
  { label: "Syd Mead",      value: "Syd Mead style, retrofuturist industrial design, chrome and neon",           era: "Sci-fi" },
  { label: "McQuarrie",     value: "Ralph McQuarrie style, classic sci-fi concept art, Star Wars aesthetic",     era: "Sci-fi" },
  { label: "Moebius",       value: "Moebius style, ligne claire, psychedelic sci-fi, soft colors",               era: "Sci-fi" },
];

const ERAS = ["Classic", "Modern", "Fantasy", "Digital", "Sci-fi"];
const ERA_COLORS: Record<string, string> = {
  Classic: "#FB7185",
  Modern:  "#FB7185",
  Fantasy: "#FB7185",
  Digital: "#FB7185",
  "Sci-fi":"#FB7185",
};

export function ArtistStyleNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const selected = (data.artist as string) ?? "";
  const activeEra = (data.era as string) ?? "Classic";

  const filtered = ARTISTS.filter((a) => a.era === activeEra);

  return (
    <div className="retro-node" style={{ width: 340 }}>
      <div className="retro-node-header node-drag-handle node-header-rose">
        <PenLine size={16} />
        <span>Artist Style</span>
        {selected && (
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#FB7185" }}>
            {ARTISTS.find(a => a.value === selected)?.label}
          </span>
        )}
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight={!selected} />
      </div>
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Era tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {ERAS.map((era) => (
            <button
              key={era}
              onClick={() => updateNodeData(id, { era })}
              className="nodrag"
              style={{
                flex: 1, padding: "5px 4px", borderRadius: 5, cursor: "pointer",
                fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700,
                letterSpacing: "0.04em", transition: "all 0.1s",
                background: activeEra === era
                  ? "linear-gradient(180deg,rgba(225,29,72,0.22) 0%,rgba(159,18,57,0.14) 100%)"
                  : "linear-gradient(180deg,#231A18 0%,#1C1614 100%)",
                border: `1.5px solid ${activeEra === era ? "rgba(225,29,72,0.5)" : "#3A2218"}`,
                color: activeEra === era ? "#FB7185" : "#706060",
                boxShadow: activeEra === era ? "0 2px 0 #3A0820,inset 0 1px 0 rgba(251,113,133,0.1)" : "0 2px 0 #100806",
              }}
            >
              {era}
            </button>
          ))}
        </div>

        {/* Artists grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          {filtered.map((a) => {
            const active = selected === a.value;
            return (
              <button
                key={a.value}
                onClick={() => updateNodeData(id, { artist: active ? "" : a.value, modifier: active ? "" : a.value })}
                className="nodrag"
                style={{
                  padding: "8px 10px", borderRadius: 7, cursor: "pointer",
                  fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 600,
                  transition: "all 0.1s", textAlign: "center",
                  background: active
                    ? "linear-gradient(180deg,rgba(225,29,72,0.25) 0%,rgba(159,18,57,0.16) 100%)"
                    : "linear-gradient(180deg,#231A18 0%,#1C1614 100%)",
                  border: `1.5px solid ${active ? "rgba(225,29,72,0.45)" : "#3A2218"}`,
                  borderBottomColor: active ? "rgba(80,8,28,0.6)" : "#150C0A",
                  color: active ? "#FB7185" : "#706060",
                  boxShadow: active
                    ? "0 2px 0 #3A0820,0 0 10px rgba(225,29,72,0.18),inset 0 1px 0 rgba(251,113,133,0.1)"
                    : "0 2px 0 #100806",
                }}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="artist-out"
        style={{ background: "#E11D48", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
